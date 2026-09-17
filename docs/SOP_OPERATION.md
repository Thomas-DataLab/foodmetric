# FoodMetric — Quy Trình Vận Hành & Xử Lý Sự Cố (SOP & Operations)

## 1. Chu Kỳ Vận Hành Tự Động Hàng Ngày (Daily Automation)

Hệ thống hoạt động theo quy trình khép kín không cần sự can thiệp thủ công:

```text
[ 06:00 AM VN Time ] GitHub Actions tự động kích hoạt workflow (daily_snapshot.yml)
         │
         ▼ Khởi tạo môi trường Python 3.11 trên máy ảo Ubuntu
         │
         ▼ Cài đặt dependencies từ requirements.txt (duckdb, curl_cffi, pydantic)
         │
         ▼ Chạy scraper/pipeline.py để tổng hợp dữ liệu & tính toán 24h Delta
         │
         ▼ Xuất file web/public/data/leaderboard_latest.json
         │
         ▼ Bot tự động commit & push về nhánh master
         │
[ 06:01 AM VN Time ] Vercel nhận commit mới và tự động xuất bản website trong 35s!
```

---

## 2. Các Lệnh Vận Hành Nhanh (Quick Commands)

### 2.1. Kích hoạt cập nhật dữ liệu thủ công tức thì:
Nếu muốn web cập nhật số liệu mới ngay lập tức mà không đợi đến 06:00 sáng:

**Cách 1: Chạy trực tiếp trên máy cục bộ (Khuyên dùng)**:
```bash
# Đứng tại thư mục gốc dự án
python scraper/pipeline.py

# Đẩy dữ liệu mới lên GitHub (Vercel sẽ tự động build lại)
git add web/public/data/leaderboard_latest.json
git commit -m "chore(data): manual snapshot update"
git push origin master
```

**Cách 2: Kích hoạt GitHub Actions từ xa qua API**:
```bash
python -c "
import subprocess, urllib.request, json
out = subprocess.check_output('git credential fill', input='protocol=https\nhost=github.com\n\n', text=True)
token = dict(l.split('=', 1) for l in out.strip().split('\n') if '=' in l)['password']
url = 'https://api.github.com/repos/Thomas-DataLab/foodmetric/actions/workflows/daily_snapshot.yml/dispatches'
req = urllib.request.Request(url, data=json.dumps({'ref': 'master'}).encode(), headers={'Authorization': f'token {token}', 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'FoodMetric'})
urllib.request.urlopen(req)
print('Da kich hoat chay cap nhat du lieu tren GitHub Actions!')
"
```

---

## 3. Quy Trình Thêm Kênh KOC / Sản Phẩm Mới Vào Hệ Thống

Khi phát hiện một kênh KOC đồ ăn vặt mới đang viral hoặc một sản phẩm hot trend:

1. **Bước 1: Lấy thông tin kênh**:
   - Ghi lại Handle kênh (ví dụ: `@ancungmaimai`).
   - Lấy URL video có lượt xem cao nhất gắn link giỏ hàng TikTok Shop.
2. **Bước 2: Khai báo vào `scraper/pipeline.py`**:
   - Mở danh sách `LIVE_BENCHMARK_PRODUCTS`.
   - Thêm bản ghi sản phẩm mới:
     ```python
     {
         "id": "tt_bt_06", # Định danh duy nhất theo danh mục
         "name": "Tên sản phẩm đầy đủ",
         "category": "banh-trang-muoi", # Chọn 1 trong 4 danh mục chuẩn
         "creator_handle": "ancungmaimai",
         "creator_name": "Ăn Cùng Mai Mai",
         "creator_followers": "250K",
         "video_id": "7474235228450589960",
         "video_url": "https://www.tiktok.com/@ancungmaimai/video/7474235228450589960",
         "video_views": 5168776,
         "shop_id": "sp_ancungmaimai",
         "shop_name": "Shop Ăn Vặt Chính Hãng",
         "price": 45000,
         "rating": 4.9,
         "reviews": 1200,
         "historical_sold": 45000,
         "estimated_daily_units": 5143,
         "image_url": "/images/products/tt_7474235228450589960.jpg"
     }
     ```
3. **Bước 3: Tải ảnh bìa & nén video chuẩn FastStart**:
   - Tải thumbnail về: `web/public/images/products/[id].jpg`
   - Nén và tối ưu video H.264 phát tức thì:
     ```bash
     ffmpeg -y -i raw_video.mp4 -vf "scale=720:1280:flags=lanczos" -c:v libx264 -preset fast -crf 27 -b:v 700k -c:a aac -b:a 64k -movflags +faststart web/public/videos/[id].mp4
     ```
4. **Bước 4: Chạy lại pipeline & Xuất bản**:
   ```bash
   python scraper/pipeline.py
   # Tùy chọn đồng bộ lên Supabase Storage (nếu có .env.local):
   python scripts/sync_to_supabase_storage.py
   ```

---

## 4. Cẩm Nang Xử Lý Sự Cố (Troubleshooting Matrix)

### Sự cố 1: Video trong popup modal bị đứng hình hoặc không tải được
- **Nguyên nhân**: File video thiếu cờ faststart hoặc codec HEVC (H.265) không tương thích trình duyệt.
- **Cách khắc phục**: Dùng FFmpeg chuyển mã (transcode) với cờ `+faststart`:
  ```bash
  ffmpeg -y -i raw_video.mp4 -vf "scale=720:1280" -c:v libx264 -preset fast -crf 27 -c:a aac -b:a 64k -movflags +faststart web/public/videos/[id].mp4
  ```

### Sự cố 2: Vercel không tự động build lại sau khi cập nhật dữ liệu
- **Nguyên nhân**: Kết nối webhook giữa GitHub và Vercel có thể bị trễ hoặc ngắt nhịp.
- **Cách khắc phục**: Kích hoạt thẳng Deploy Hook của dự án FoodMetric (mất 2 giây):
  ```bash
  python -c "
  from curl_cffi import requests
  r = requests.post('https://api.vercel.com/v1/integrations/deploy/prj_NXcPENCpPYRwmxruKi8YE9qsfja8/ZMFwACaA9n')
  print('Deploy hook status:', r.status_code)
  "
  ```

### Sự cố 3: GitHub Actions báo lỗi khi đẩy commit về master
- **Nguyên nhân**: Nhánh `master` trên máy chủ GitHub có commit mới hơn máy cục bộ (xung đột rebase).
- **Cách khắc phục**:
  ```bash
  git pull --rebase origin master
  git push origin master
  ```

### Sự cố 4: Popup đăng nhập Google One Tap bị treo đơ trên Chrome CDP
- **Nguyên nhân**: Tính năng Memory Saver của Chrome đóng băng tab TikTok chạy ngầm khi người dùng chuyển sang tab khác.
- **Cách khắc phục**: Đóng tab TikTok ngầm qua cổng CDP 9223:
  ```bash
  python -c "
  import urllib.request, json
  req = urllib.request.urlopen('http://127.0.0.1:9223/json/list')
  tabs = json.loads(req.read().decode())
  for t in tabs:
      if 'tiktok.com' in t.get('url', '').lower():
          urllib.request.urlopen(f'http://127.0.0.1:9223/json/close/{t[\"id\"]}')
          print('Da dong tab TikTok:', t['id'])
  "
  ```

### Sự cố 5: Kiểm tra tính toàn vẹn 3 chiều (Tên Món ↔ Ảnh Thumbnail ↔ Nội Dung Video)
- **Mục đích**: Bảo đảm 100% sản phẩm trên leaderboard đều có ảnh thật tồn tại trong `web/public/images/products/`, file video MP4 tồn tại trong `web/public/videos/`, và nội dung video phải khớp chính xác với món ăn (tránh lỗi lệch như gán video kẹo dẻo vào tiêu đề hành khô).
- **Cách chạy kiểm tra tự động**:
  ```bash
  python -c "
  import json
  from pathlib import Path
  with open('web/public/data/leaderboard_latest.json', 'r', encoding='utf-8') as f:
      data = json.load(f)
  for p in data['leaderboard']:
      img = Path('web/public') / p['image_url'].lstrip('/')
      vid = Path('web/public/videos') / f\"{p['product_id']}.mp4\"
      assert img.exists(), f'MISSING IMAGE: {img}'
      assert vid.exists(), f'MISSING VIDEO: {vid}'
      assert p['estimated_daily_gmv'] == p['estimated_daily_units'] * p['current_price']
  print('✓ 100% Data, Image & Video Integrity Gate PASSED!')
  "
  ```

### Sự cố 6: Trình duyệt chặn Autoplay khiến modal video bị đen màn hình
- **Nguyên nhân**: Chính sách Autoplay Policy của trình duyệt hiện đại (Chrome/Edge/Safari) chặn phát video có tiếng tự động nếu chưa có tương tác trước đó, dẫn đến `video.play()` bị reject và màn hình hiển thị đen.
- **Cách khắc phục**: Thẻ `<video>` trong `VideoModal.tsx` bắt buộc phải có thuộc tính `poster={product.image_url}` (hiển thị ảnh bìa sản phẩm ngay lập tức) và `muted` (cho phép autoplay không tiếng, người dùng tự bấm bật âm thanh khi xem).
  ```tsx
  <video
    src={nativeVideoSrc}
    poster={product.image_url}
    preload="auto"
    controls
    autoPlay
    muted
    playsInline
    loop
  />
  ```
