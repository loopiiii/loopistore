/**
 * LOOPI - Giỏ Hàng & Quản Lý Trạng Thái (bản địa hóa Việt Nam)
 * Giỏ hàng, danh sách yêu thích, mã giảm giá và thông báo toast.
 * Phụ thuộc: products.js (PRODUCTS, formatVND, FREE_SHIP_THRESHOLD, SHIPPING_FEE)
 */

const CART_STORAGE_KEY = "loopi_cart_v1";
const WISHLIST_STORAGE_KEY = "loopi_wishlist_v1";

class CartManager {
  constructor() {
    this.cart = this.loadCart();
    this.wishlist = this.loadWishlist();
    this.activeCoupon = null;
    this.validCoupons = {
      "LOOPI15": { discount: 0.15, description: "Giảm 15% – Chào mừng bạn mới" },
      "FINDJOY": { discount: 0.10, description: "Giảm 10% – Niềm vui khám phá" },
      "SURPRISE10": { discount: 0.10, description: "Giảm 10% – Ưu đãi vòng quay may mắn" }
    };

    this.init();
  }

  loadCart() {
    try {
      const data = localStorage.getItem(CART_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  saveCart() {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.cart));
    } catch (e) {
      console.warn("Storage not available");
    }
    this.updateUI();
  }

  loadWishlist() {
    try {
      const data = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  saveWishlist() {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(this.wishlist));
    } catch (e) {
      console.warn("Storage not available");
    }
    this.updateWishlistUI();
  }

  init() {
    this.updateUI();
    this.updateWishlistUI();
    this.bindEvents();
  }

  bindEvents() {
    const cartBtn = document.getElementById("header-cart-btn");
    const cartCloseBtn = document.getElementById("cart-drawer-close");
    const cartBackdrop = document.getElementById("cart-drawer-backdrop");
    const continueShoppingBtn = document.getElementById("cart-empty-cta");

    cartBtn?.addEventListener("click", () => this.openCart());
    cartCloseBtn?.addEventListener("click", () => this.closeCart());
    cartBackdrop?.addEventListener("click", () => this.closeCart());
    continueShoppingBtn?.addEventListener("click", () => {
      this.closeCart();
      document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
    });

    // Coupon form
    const couponForm = document.getElementById("cart-coupon-form");
    couponForm?.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = document.getElementById("cart-coupon-input");
      if (input) this.applyCoupon(input.value.trim().toUpperCase());
    });

    // Wishlist Drawer
    const wishlistBtn = document.getElementById("header-wishlist-btn");
    const wishlistCloseBtn = document.getElementById("wishlist-drawer-close");
    const wishlistBackdrop = document.getElementById("wishlist-drawer-backdrop");

    wishlistBtn?.addEventListener("click", () => this.openWishlist());
    wishlistCloseBtn?.addEventListener("click", () => this.closeWishlist());
    wishlistBackdrop?.addEventListener("click", () => this.closeWishlist());

    // Checkout
    const checkoutBtn = document.getElementById("cart-checkout-btn");
    checkoutBtn?.addEventListener("click", () => this.handleCheckout());
  }

  openCart() {
    const drawer = document.getElementById("cart-drawer");
    const backdrop = document.getElementById("cart-drawer-backdrop");
    if (drawer && backdrop) {
      drawer.classList.add("active");
      backdrop.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  }

  closeCart() {
    const drawer = document.getElementById("cart-drawer");
    const backdrop = document.getElementById("cart-drawer-backdrop");
    if (drawer && backdrop) {
      drawer.classList.remove("active");
      backdrop.classList.remove("active");
      document.body.style.overflow = "";
    }
  }

  openWishlist() {
    const drawer = document.getElementById("wishlist-drawer");
    const backdrop = document.getElementById("wishlist-drawer-backdrop");
    if (drawer && backdrop) {
      drawer.classList.add("active");
      backdrop.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  }

  closeWishlist() {
    const drawer = document.getElementById("wishlist-drawer");
    const backdrop = document.getElementById("wishlist-drawer-backdrop");
    if (drawer && backdrop) {
      drawer.classList.remove("active");
      backdrop.classList.remove("active");
      document.body.style.overflow = "";
    }
  }

  addItem(productId, quantity = 1, showToast = true) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const existingIndex = this.cart.findIndex(item => item.id === productId);
    if (existingIndex > -1) {
      this.cart[existingIndex].quantity += quantity;
    } else {
      this.cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        categoryName: product.categoryName,
        quantity: quantity
      });
    }

    this.saveCart();

    if (showToast) {
      this.showToast(`✨ Đã thêm "${product.name}" vào giỏ hàng!`, "cart");
      this.bounceCartIcon();
    }
  }

  updateQuantity(productId, newQty) {
    const index = this.cart.findIndex(item => item.id === productId);
    if (index > -1) {
      if (newQty <= 0) {
        this.cart.splice(index, 1);
      } else {
        this.cart[index].quantity = newQty;
      }
      this.saveCart();
    }
  }

  removeItem(productId) {
    const index = this.cart.findIndex(item => item.id === productId);
    if (index > -1) {
      const removed = this.cart.splice(index, 1)[0];
      this.saveCart();
      this.showToast(`Đã xóa "${removed.name}" khỏi giỏ hàng`, "info");
    }
  }

  toggleWishlist(productId) {
    const index = this.wishlist.indexOf(productId);
    const product = PRODUCTS.find(p => p.id === productId);
    const prodName = product ? product.name : "Sản phẩm";

    if (index > -1) {
      this.wishlist.splice(index, 1);
      this.saveWishlist();
      this.showToast(`Đã bỏ "${prodName}" khỏi yêu thích`, "info");
      return false;
    } else {
      this.wishlist.push(productId);
      this.saveWishlist();
      this.showToast(`💖 Đã thêm "${prodName}" vào yêu thích!`, "wishlist");
      return true;
    }
  }

  isWishlisted(productId) {
    return this.wishlist.includes(productId);
  }

  applyCoupon(code) {
    if (this.validCoupons[code]) {
      this.activeCoupon = {
        code: code,
        ...this.validCoupons[code]
      };
      this.showToast(`🎉 Áp dụng mã "${code}" thành công: ${this.activeCoupon.description}`, "success");
      this.updateUI();
    } else {
      this.showToast(`❌ Mã không hợp lệ. Thử "LOOPI15" để giảm 15%!`, "error");
    }
  }

  removeCoupon() {
    this.activeCoupon = null;
    this.updateUI();
    this.showToast("Đã hủy mã giảm giá", "info");
  }

  getSubtotal() {
    return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  getDiscount() {
    if (!this.activeCoupon) return 0;
    return Math.round(this.getSubtotal() * this.activeCoupon.discount);
  }

  getTotalItems() {
    return this.cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  updateUI() {
    const totalItems = this.getTotalItems();
    const subtotal = this.getSubtotal();
    const discount = this.getDiscount();
    const isFreeShip = subtotal >= FREE_SHIP_THRESHOLD || subtotal === 0;
    const shipping = isFreeShip ? 0 : SHIPPING_FEE;
    const finalTotal = Math.max(0, subtotal - discount + shipping);

    // Header badge
    const cartBadge = document.getElementById("header-cart-count");
    if (cartBadge) {
      cartBadge.textContent = totalItems;
      cartBadge.style.display = totalItems > 0 ? "flex" : "none";
    }

    // Cart title count
    const cartTitleCount = document.getElementById("cart-header-count");
    if (cartTitleCount) {
      cartTitleCount.textContent = `(${totalItems} sản phẩm)`;
    }

    // Shipping progress
    const shippingBar = document.getElementById("shipping-progress-bar");
    const shippingText = document.getElementById("shipping-progress-text");
    if (shippingBar && shippingText) {
      if (subtotal === 0) {
        shippingBar.style.width = "0%";
        shippingText.innerHTML = `Mua thêm <strong>${formatVND(FREE_SHIP_THRESHOLD)}</strong> để được <strong>miễn phí vận chuyển toàn quốc!</strong>`;
      } else if (subtotal >= FREE_SHIP_THRESHOLD) {
        shippingBar.style.width = "100%";
        shippingText.innerHTML = `🎉 Bạn đã được <strong>miễn phí vận chuyển toàn quốc!</strong>`;
      } else {
        const remaining = FREE_SHIP_THRESHOLD - subtotal;
        const pct = Math.min(100, (subtotal / FREE_SHIP_THRESHOLD) * 100);
        shippingBar.style.width = `${pct}%`;
        shippingText.innerHTML = `Mua thêm <strong>${formatVND(remaining)}</strong> để được <strong>miễn phí vận chuyển!</strong>`;
      }
    }

    // Cart items
    const cartList = document.getElementById("cart-items-list");
    const cartEmpty = document.getElementById("cart-empty-state");
    const cartFooter = document.getElementById("cart-drawer-footer");

    if (cartList && cartEmpty && cartFooter) {
      if (this.cart.length === 0) {
        cartList.innerHTML = "";
        cartEmpty.style.display = "flex";
        cartFooter.style.display = "none";
      } else {
        cartEmpty.style.display = "none";
        cartFooter.style.display = "block";
        cartList.innerHTML = this.cart.map(item => `
          <div class="cart-item" data-id="${item.id}">
            <img src="${item.image}" alt="${item.name}" class="cart-item-img" />
            <div class="cart-item-details">
              <span class="cart-item-cat">${item.categoryName}</span>
              <h4 class="cart-item-title">${item.name}</h4>
              <div class="cart-item-price">${formatVND(item.price)}</div>
              <div class="cart-item-controls">
                <div class="qty-stepper">
                  <button class="qty-btn minus" onclick="cartManager.updateQuantity('${item.id}', ${item.quantity - 1})">−</button>
                  <span class="qty-val">${item.quantity}</span>
                  <button class="qty-btn plus" onclick="cartManager.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                </div>
                <button class="cart-item-remove" onclick="cartManager.removeItem('${item.id}')">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                  Xóa
                </button>
              </div>
            </div>
          </div>
        `).join("");
      }
    }

    // Totals
    const subtotalEl = document.getElementById("cart-subtotal");
    const discountEl = document.getElementById("cart-discount");
    const discountRow = document.getElementById("cart-discount-row");
    const shippingEl = document.getElementById("cart-shipping");
    const totalEl = document.getElementById("cart-total");

    if (subtotalEl) subtotalEl.textContent = formatVND(subtotal);
    if (discountRow && discountEl) {
      if (discount > 0) {
        discountRow.style.display = "flex";
        discountEl.textContent = `-${formatVND(discount)} (${this.activeCoupon.code})`;
      } else {
        discountRow.style.display = "none";
      }
    }
    if (shippingEl) {
      shippingEl.textContent = shipping === 0 ? "MIỄN PHÍ" : formatVND(shipping);
      shippingEl.classList.toggle("free-badge", shipping === 0);
    }
    if (totalEl) totalEl.textContent = formatVND(finalTotal);
  }

  updateWishlistUI() {
    const countBadge = document.getElementById("header-wishlist-count");
    if (countBadge) {
      countBadge.textContent = this.wishlist.length;
      countBadge.style.display = this.wishlist.length > 0 ? "flex" : "none";
    }

    const listEl = document.getElementById("wishlist-items-list");
    const emptyEl = document.getElementById("wishlist-empty-state");

    if (listEl && emptyEl) {
      if (this.wishlist.length === 0) {
        listEl.innerHTML = "";
        emptyEl.style.display = "flex";
      } else {
        emptyEl.style.display = "none";
        const wishlistedProds = PRODUCTS.filter(p => this.wishlist.includes(p.id));
        listEl.innerHTML = wishlistedProds.map(prod => `
          <div class="wishlist-item" data-id="${prod.id}">
            <img src="${prod.image}" alt="${prod.name}" class="wishlist-item-img" />
            <div class="wishlist-item-details">
              <span class="cart-item-cat">${prod.categoryName}</span>
              <h4 class="cart-item-title">${prod.name}</h4>
              <div class="cart-item-price">${formatVND(prod.price)}</div>
              <div class="wishlist-item-actions">
                <button class="btn btn-primary btn-sm" onclick="cartManager.addItem('${prod.id}'); cartManager.toggleWishlist('${prod.id}');">
                  Chuyển vào giỏ
                </button>
                <button class="cart-item-remove" onclick="cartManager.toggleWishlist('${prod.id}')">
                  Xóa
                </button>
              </div>
            </div>
          </div>
        `).join("");
      }
    }

    // Refresh heart buttons
    document.querySelectorAll(".product-fav-btn").forEach(btn => {
      const pid = btn.getAttribute("data-id");
      if (pid && this.isWishlisted(pid)) {
        btn.classList.add("active");
        btn.setAttribute("aria-label", "Bỏ khỏi yêu thích");
      } else if (pid) {
        btn.classList.remove("active");
        btn.setAttribute("aria-label", "Thêm vào yêu thích");
      }
    });
  }

  handleCheckout() {
    if (this.cart.length === 0) {
      this.showToast("Giỏ hàng đang trống! Hãy khám phá sản phẩm trước nhé.", "info");
      return;
    }

    const modal = document.getElementById("checkout-success-modal");
    if (modal) {
      const orderNum = "LP-" + Math.floor(100000 + Math.random() * 900000);
      const totalAmount = document.getElementById("cart-total")?.textContent || "0₫";

      const orderNumEl = document.getElementById("order-number-display");
      const orderTotalEl = document.getElementById("order-total-display");
      if (orderNumEl) orderNumEl.textContent = orderNum;
      if (orderTotalEl) orderTotalEl.textContent = totalAmount;

      this.closeCart();
      modal.classList.add("active");
      document.getElementById("checkout-modal-backdrop")?.classList.add("active");
      document.body.style.overflow = "hidden";

      // Clear cart
      this.cart = [];
      this.activeCoupon = null;
      this.saveCart();

      window.confettiEffect?.();
    }
  }

  bounceCartIcon() {
    const icon = document.getElementById("header-cart-btn");
    if (icon) {
      icon.classList.remove("bounce-anim");
      void icon.offsetWidth;
      icon.classList.add("bounce-anim");
    }
  }

  showToast(message, type = "info") {
    let container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      container.className = "toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast-item toast-${type}`;

    let iconSvg = "🌀";
    if (type === "cart") iconSvg = "🛒";
    if (type === "wishlist") iconSvg = "💖";
    if (type === "success") iconSvg = "🎉";
    if (type === "error") iconSvg = "⚠️";

    toast.innerHTML = `
      <span class="toast-icon">${iconSvg}</span>
      <span class="toast-message">${message}</span>
      <button class="toast-close">&times;</button>
    `;

    toast.querySelector(".toast-close").addEventListener("click", () => {
      toast.classList.add("fade-out");
      setTimeout(() => toast.remove(), 300);
    });

    container.appendChild(toast);

    setTimeout(() => {
      if (toast.parentElement) {
        toast.classList.add("fade-out");
        setTimeout(() => toast.remove(), 300);
      }
    }, 3800);
  }
}

// Global instance
let cartManager;
document.addEventListener("DOMContentLoaded", () => {
  cartManager = new CartManager();
  window.cartManager = cartManager;
});
