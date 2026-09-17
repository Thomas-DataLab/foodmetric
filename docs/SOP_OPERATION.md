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
3. **Bước 3: Tải ảnh bìa & video về máy**:
   - Tải thumbnail về: `web/public/images/products/[id].jpg`
   - Tải video gốc sạch về: `web/public/videos/[id].mp4`
4. **Bước 4: Chạy lại pipeline**:
   `python scraper/pipeline.py` -> Xong!

---

## 4. Cẩm Nang Xử Lý Sự Cố (Troubleshooting Matrix)

### Sự cố 1: Video trong popup modal bị đứng hình, chỉ nghe thấy tiếng
- **Nguyên nhân**: Stream video gốc tải về từ TikTok được mã hóa bằng codec HEVC (H.265) hoặc VP9 không được hỗ trợ mặc định trên một số trình duyệt web máy tính.
- **Cách khắc phục**: Dùng FFmpeg chuyển mã (transcode) video sang chuẩn H.264 phổ quát:
  ```bash
  ffmpeg -y -i raw_video.mp4 -c:v libx264 -preset fast -crf 22 -c:a aac -b:a 128k web/public/videos/[id].mp4
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
