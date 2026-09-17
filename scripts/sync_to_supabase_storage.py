"""
sync_to_supabase_storage.py — Cloud Storage Sync Engine (0đ, No Credit Card)
=============================================================================
Đồng bộ toàn bộ video MP4 từ web/public/videos/ lên Supabase Storage (1GB Free Tier, không cần thẻ).
Tách rời hoàn toàn kho video ra khỏi Git repository để duy trì mã nguồn siêu nhẹ.
"""

import os
import sys
from pathlib import Path
from typing import Optional

PROJECT_ROOT = Path(__file__).resolve().parent.parent
VIDEOS_DIR = PROJECT_ROOT / "web" / "public" / "videos"

def load_env_vars():
    """Đọc biến môi trường từ .env.local nếu có."""
    env_file = PROJECT_ROOT / ".env.local"
    if not env_file.exists():
        env_file = PROJECT_ROOT / "web" / ".env.local"
    
    if env_file.exists():
        with open(env_file, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, v = line.split("=", 1)
                    os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))

def main():
    load_env_vars()
    supabase_url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL") or os.environ.get("SUPABASE_URL")
    supabase_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("SUPABASE_ANON_KEY")

    if not supabase_url or not supabase_key or "your-project" in supabase_url:
        print("=" * 70)
        print("[!] CHƯA CẤU HÌNH BIẾN MÔI TRƯỜNG SUPABASE")
        print("=" * 70)
        print("Để đồng bộ video lên Supabase Storage (1GB Free, 0đ, không cần thẻ):")
        print("1. Mở file .env.local tại thư mục gốc.")
        print("2. Điền thông tin dự án Supabase của bạn:")
        print("   NEXT_PUBLIC_SUPABASE_URL=https://<project-id>.supabase.co")
        print("   SUPABASE_SERVICE_ROLE_KEY=<service-role-secret-key>")
        print("3. Chạy lại lệnh: python scripts/sync_to_supabase_storage.py")
        print("=" * 70)
        return

    try:
        from supabase import create_client, Client
    except ImportError:
        print("[!] Đang cài đặt thư viện supabase...")
        import subprocess
        subprocess.check_call([sys.executable, "-m", "pip", "install", "supabase"])
        from supabase import create_client, Client

    print(f"[*] Kết nối tới Supabase Storage: {supabase_url}...")
    client: Client = create_client(supabase_url, supabase_key)

    bucket_name = "foodmetric-videos"

    # Kiểm tra hoặc tạo bucket public
    try:
        buckets = client.storage.list_buckets()
        existing = [b.name for b in buckets]
        if bucket_name not in existing:
            print(f"[*] Tạo mới public storage bucket: '{bucket_name}'...")
            client.storage.create_bucket(bucket_name, options={"public": True})
            print(f"[✓] Đã tạo thành công bucket: {bucket_name}")
        else:
            print(f"[✓] Bucket '{bucket_name}' đã sẵn sàng.")
    except Exception as e:
        print(f"[!] Kiểm tra bucket: {e}")

    # Tải từng video lên Supabase Storage
    video_files = sorted(VIDEOS_DIR.glob("*.mp4"))
    print(f"[*] Tìm thấy {len(video_files)} file video cần đồng bộ...")

    success_count = 0
    cdn_links = {}

    for idx, v_file in enumerate(video_files, 1):
        file_name = v_file.name
        file_size_mb = v_file.stat().st_size / (1024 * 1024)
        print(f"[{idx}/{len(video_files)}] Đang đẩy {file_name} ({file_size_mb:.2f} MB)...")

        try:
            with open(v_file, "rb") as f:
                file_bytes = f.read()

            # Upload (upsert)
            client.storage.from_(bucket_name).upload(
                path=file_name,
                file=file_bytes,
                file_options={"content-type": "video/mp4", "upsert": "true"}
            )
            
            public_url = client.storage.from_(bucket_name).get_public_url(file_name)
            cdn_links[file_name] = public_url
            print(f"  ✓ Đã upload: {public_url}")
            success_count += 1
        except Exception as e:
            print(f"  ✗ Lỗi khi đẩy {file_name}: {e}")

    print("\n" + "=" * 70)
    print(f"[✓] HOÀN TẤT ĐỒNG BỘ: {success_count}/{len(video_files)} video đã lên Supabase CDN!")
    print("=" * 70)

if __name__ == "__main__":
    main()
