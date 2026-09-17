# FoodMetric — Hướng Dẫn Đóng Góp & Quy Chuẩn Kỹ Thuật (Contributing Guide)

## 1. Nguyên Tắc Bất Biến (Golden Invariants)
Bất kỳ lập trình viên hay AI Agent nào khi tham gia phát triển dự án FoodMetric đều bắt buộc tuân thủ 5 nguyên tắc sau:
1. **0đ Infrastructure Gate**: Tuyệt đối không tích hợp dịch vụ cloud trả phí (AWS, Google Cloud, Proxy trả phí). Chỉ sử dụng Vercel Free, GitHub Actions và DuckDB cục bộ.
2. **Deterministic Financial Math**: 
   - `GMV = Units * Price` (tuyệt đối không bịa số hoặc làm tròn sai).
   - `Daily Units = Max(0, Sold_Today - Sold_Yesterday)`.
3. **Strict TypeScript Standards**:
   - Nghiêm cấm sử dụng kiểu dữ liệu `any`.
   - Mọi API payload, Component props và Data records phải có Interface định nghĩa tường minh trong `web/types/index.ts`.
4. **Design System Consistency**:
   - Giao diện 100% Light Theme (Clean White/Zinc canvas).
   - Font chữ: **Inter** cho văn bản mô tả, **Lexend** cho số liệu và Tabular Numbers.
5. **Test Regression Gate**:
   - Toàn bộ 46 Unit Tests trong `tests/test_discovery.py` phải PASS 100% trước khi commit bất kỳ thay đổi nào.

---

## 2. Quy Chuẩn Đặt Tên & Commit Git (Conventional Commits)
- `feat:` Thêm tính năng mới (ví dụ: `feat(traffic): add OpenGraph metadata and CTA funnel`).
- `fix:` Sửa lỗi (ví dụ: `fix(player): transcode video to H.264 for desktop playback`).
- `chore:` Công việc bảo trì, cập nhật dữ liệu (ví dụ: `chore(data): daily snapshot refresh`).
- `docs:` Viết hoặc cập nhật tài liệu dự án.
- `refactor:` Tái cấu trúc mã nguồn nhưng không đổi logic bên ngoài.

---

## 3. Quy Trình Kiểm Thử Trước Khi Push (Pre-Push Checklist)
Trước khi push code lên nhánh `master`:
```bash
# 1. Kiểm tra Unit Tests (46 tests phải pass)
python -m pytest tests/test_discovery.py

# 2. Kiểm tra biên dịch Next.js (0 lỗi TypeScript và Lint)
cd web && npm run build
```
