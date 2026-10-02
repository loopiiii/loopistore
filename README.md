# 🌀 LOOPI — Things Worth Finding
> **Concept Store cho những bạn trẻ yêu thích những món đồ đẹp, hữu ích và đầy cảm hứng.**

[![GitHub Pages Deployment](https://img.shields.io/badge/Demo-Live%20on%20GitHub%20Pages-blue?style=for-the-badge&logo=github)](https://loopiiii.github.io/loopistore/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

---

## 🌟 Giới thiệu Dự án

**LOOPI Store** là một website thương mại điện tử hiện đại, mang ngôn ngữ thiết kế tươi mới, phong cách Gen Z tinh tế với gam màu chủ đạo Xanh Navy (`#2A5298`) kết hợp Hồng Phấn (`#D26E9E`). Website được xây dựng thuần túy bằng **HTML5, CSS3 và Vanilla JavaScript (ES6+)**, không phụ thuộc thư viện nặng nề, tốc độ tải trang cực nhanh và tương thích hoàn hảo trên mọi thiết bị.

🔗 **Xem trực tiếp (Live Demo):** [https://loopiiii.github.io/loopistore/](https://loopiiii.github.io/loopistore/)

---

## 📱 Khả năng Tương thích & Responsive Hoàn toàn

Giao diện được thiết kế thích ứng động bằng **CSS Grid, Flexbox, `clamp()`, `min()` và `rem`**, đảm bảo hiển thị liền mạch trên:
* 🖥️ **Màn hình lớn / Ultra-wide Desktop:** 1920px+
* 💻 **Laptop tiêu chuẩn:** 1440px
* 💻 **MacBook Air / MacBook Pro:** 13-inch, 14-inch, 16-inch
* 📱 **Tablet & iPad:** 768px – 1024px
* 📲 **Điện thoại thông minh:** iPhone (390px, 414px, 430px), Android (360px – 480px)
* 🔍 **Kiểm tra mức Zoom trình duyệt:** Không vỡ layout ở mọi mức zoom **100%, 125%, 150%, 175%, 200%**.
* 🌐 **Trình duyệt hỗ trợ:** Google Chrome, Apple Safari (macOS & iOS Safe Area), Microsoft Edge, Mozilla Firefox.

---

## ✨ Tính năng Nổi bật

1. **Bộ sưu tập Sản phẩm Tuyển chọn:**
   - 14 sản phẩm độc đáo chia thành 5 danh mục: *Góc làm việc & Học tập*, *Sống phong cách*, *Không gian ấm áp*, *Phụ kiện mỗi ngày*, *Quà tặng tinh tế*.
2. **Bộ lọc & Sắp xếp Thời gian thực:**
   - Lọc theo danh mục tức thì.
   - Sắp xếp theo giá (tăng/giảm), đánh giá cao nhất, độ phổ biến.
   - Thanh tìm kiếm sản phẩm thông minh với gợi ý trực tiếp.
3. **Giỏ hàng & Wishlist (Local Storage):**
   - Side drawer trượt mượt mà.
   - Thêm/bớt/xóa số lượng sản phẩm.
   - Áp dụng mã giảm giá (`LOOPI15` - giảm 15%).
   - Thanh tiến trình freeship thông minh (miễn phí vận chuyển từ 299.000₫).
   - Danh sách yêu thích (Wishlist) lưu lại trên trình duyệt.
4. **Modal Quick View (Xem nhanh):**
   - Xem chi tiết thông số, hình ảnh, tính năng nổi bật mà không cần chuyển trang.
5. **Nút "Khám phá ngẫu nhiên" (Surprise Me):**
   - Gợi ý ngẫu nhiên một món đồ thú vị mỗi lần bấm.
6. **Mobile Navigation Drawer:**
   - Menu di động trượt từ bên trái với trải nghiệm cảm ứng mượt mà.
7. **Phim ngắn Quảng cáo Thương hiệu (LOOPI Cinema Commercial - 24s):**
   - Video cinematic chuẩn HD phong cách visual storytelling cao cấp ("Things Worth Finding").
   - Tích hợp `IntersectionObserver` tự động phát thông minh, tiết kiệm pin và dung lượng trên điện thoại.
   - Nút bật/tắt âm thanh và nút dừng/phát nhanh chóng.

---

## 📁 Cấu trúc Thư mục

```text
loopistore/
├── index.html              # Trang chủ HTML5 chuẩn SEO & Accessibility
├── README.md               # Tài liệu dự án
├── .gitignore              # Cấu hình bỏ qua file rác / file nén
├── css/
│   └── style.css           # Toàn bộ Design System, Typography, Layout & Media Queries
├── js/
│   ├── products.js         # Dữ liệu sản phẩm & danh mục
│   ├── cart.js             # Logic giỏ hàng, mã giảm giá & Wishlist
│   └── app.js              # Xử lý giao diện, bộ lọc, modal & video controller
└── assets/
    ├── images/             # Toàn bộ hình ảnh sản phẩm, logo, banner
    └── videos/             # Video quảng cáo thương hiệu cinematic (loopi-commercial.mp4)
```

---

## 🚀 Hướng dẫn Chạy Localhost

Website không cần cài đặt `npm` hay `node_modules`. Bạn có thể chạy trực tiếp:

### Cách 1: Dùng Python (Có sẵn trên macOS / Linux / Windows)
```bash
cd /Users/duchuy/My
python3 -m http.server 8080
```
Sau đó mở trình duyệt và truy cập: **[http://localhost:8080/](http://localhost:8080/)**

### Cách 2: Dùng VS Code Live Server
* Cài extension **Live Server** trong VS Code.
* Nhấp chuột phải vào file `index.html` ➔ Chọn **Open with Live Server**.

---

## 📦 Triển khai lên GitHub Pages (Deploy)

1. Đẩy code lên nhánh `main`:
   ```bash
   git add .
   git commit -m "Fix responsive layout and cross-device compatibility"
   git push origin main
   ```
2. Vào GitHub Repository: **Settings** ➔ **Pages**.
3. Tại phần **Build and deployment**:
   - **Source:** `Deploy from a branch`
   - **Branch:** `main` / folder: `/ (root)`
4. Website sẽ tự động xuất bản tại: `https://<username>.github.io/<repo-name>/`

---

## 📄 Bản quyền

Dự án thuộc sở hữu của **LOOPI Store** — *"Things Worth Finding"*. Mọi ý tưởng thiết kế và hình ảnh đều được bảo lưu.
