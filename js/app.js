/**
 * LOOPI - Main Application Controller (bản địa hóa Việt Nam)
 * Điều hướng, lọc/sắp xếp sản phẩm, "Hôm Nay Có Gì Hay?", Quick View, tìm kiếm, hiệu ứng.
 * Phụ thuộc: products.js (PRODUCTS, CATEGORIES, formatVND), cart.js (cartManager)
 */

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  renderCategories();
  renderProducts();
  initFilterAndSort();
  initDiscoveryRoulette();
  initQuickViewModal();
  initSearchModal();
  initNewsletter();
  initCheckoutModal();
  initCanvasConfetti();
  initScrollEffects();
  initPromoVideo();
});

let currentCategoryFilter = "all";
let currentSort = "featured";
let currentSearchQuery = "";

/** Bỏ dấu tiếng Việt để tìm kiếm "den ban" vẫn ra "Đèn Bàn" */
function normalizeVN(str) {
  return String(str)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .trim();
}

function productMatches(p, q) {
  const nq = normalizeVN(q);
  return normalizeVN(p.name).includes(nq) ||
    normalizeVN(p.categoryName).includes(nq) ||
    normalizeVN(p.description).includes(nq) ||
    (p.colorway && normalizeVN(p.colorway).includes(nq));
}

function escapeHTML(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

/**
 * Navigation & Header scroll effects
 */
function initNavigation() {
  const header = document.querySelector(".site-header");
  const mobileToggle = document.getElementById("mobile-menu-toggle");
  const mobileNav = document.getElementById("mobile-nav-drawer");
  const mobileClose = document.getElementById("mobile-nav-close");
  const mobileBackdrop = document.getElementById("mobile-nav-backdrop");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) header?.classList.add("scrolled");
    else header?.classList.remove("scrolled");
  });

  function openMobileNav() {
    mobileNav?.classList.add("active");
    mobileBackdrop?.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeMobileNav() {
    mobileNav?.classList.remove("active");
    mobileBackdrop?.classList.remove("active");
    document.body.style.overflow = "";
  }

  mobileToggle?.addEventListener("click", openMobileNav);
  mobileClose?.addEventListener("click", closeMobileNav);
  mobileBackdrop?.addEventListener("click", closeMobileNav);

  document.querySelectorAll(".mobile-nav-link").forEach(link => {
    link.addEventListener("click", closeMobileNav);
  });
}

/**
 * Render Categories Section
 */
function renderCategories() {
  const grid = document.getElementById("categories-grid");
  if (!grid) return;

  grid.innerHTML = CATEGORIES.map((cat, index) => `
    <div class="category-card" data-category="${cat.id}" style="--stagger-delay: ${index * 0.08}s">
      <div class="category-img-wrap">
        <img src="${cat.image}" alt="${cat.name}" class="category-img" loading="lazy" />
        <div class="category-overlay"></div>
        <span class="category-badge">${cat.itemCount} sản phẩm</span>
      </div>
      <div class="category-content">
        <div class="category-header">
          <span class="category-icon">${cat.icon}</span>
          <h3 class="category-title">${cat.name}</h3>
        </div>
        <p class="category-tagline">${cat.tagline}</p>
        <span class="category-explore-link">
          Xem bộ sưu tập
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </span>
      </div>
    </div>
  `).join("");

  grid.querySelectorAll(".category-card").forEach(card => {
    card.addEventListener("click", () => {
      filterByCategory(card.getAttribute("data-category"));
      document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
    });
  });
}

/**
 * Render Featured Products Grid
 */
function renderProducts() {
  const grid = document.getElementById("products-grid");
  const countEl = document.getElementById("products-results-count");
  if (!grid) return;

  let filtered = [...PRODUCTS];

  if (currentCategoryFilter !== "all") {
    filtered = filtered.filter(p => p.category === currentCategoryFilter);
  }

  if (currentSearchQuery.trim() !== "") {
    filtered = filtered.filter(p => productMatches(p, currentSearchQuery));
  }

  if (currentSort === "price-low") filtered.sort((a, b) => a.price - b.price);
  else if (currentSort === "price-high") filtered.sort((a, b) => b.price - a.price);
  else if (currentSort === "rating") filtered.sort((a, b) => b.rating - a.rating);
  else if (currentSort === "name") filtered.sort((a, b) => a.name.localeCompare(b.name, "vi"));

  if (countEl) {
    countEl.textContent = `Hiển thị ${filtered.length} / ${PRODUCTS.length} sản phẩm`;
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="products-empty">
        <div class="empty-icon">🌀</div>
        <h3>Chưa tìm thấy món nào</h3>
        <p>Thử chọn danh mục khác hoặc đổi từ khóa tìm kiếm nhé.</p>
        <button class="btn btn-secondary btn-sm" onclick="resetProductFilters()">Đặt lại bộ lọc</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map((prod, index) => {
    const isFav = window.cartManager ? window.cartManager.isWishlisted(prod.id) : false;
    const discountPct = prod.originalPrice ? Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100) : null;

    return `
      <div class="product-card" data-id="${prod.id}" style="--fade-delay: ${index * 0.05}s">
        <div class="product-media-wrap">
          <img src="${prod.image}" alt="${prod.name}" class="product-img" loading="lazy" />

          <div class="product-badges-row">
            ${prod.badge ? `<span class="product-pill-badge">${prod.badge}</span>` : ""}
            ${discountPct ? `<span class="product-discount-badge">-${discountPct}%</span>` : ""}
          </div>

          <button class="product-fav-btn ${isFav ? 'active' : ''}" data-id="${prod.id}" aria-label="Thêm vào yêu thích">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </button>

          <button class="product-quickview-btn" data-id="${prod.id}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            Xem nhanh
          </button>
        </div>

        <div class="product-info">
          <div class="product-category-row">
            <span class="product-category-label">${prod.categoryName}</span>
            <div class="product-rating">
              <span class="star-icon">★</span>
              <span class="rating-num">${prod.rating.toFixed(1).replace(".", ",")}</span>
              <span class="reviews-count">(${prod.reviewsCount})</span>
            </div>
          </div>

          <h3 class="product-title" onclick="openQuickView('${prod.id}')">${prod.name}</h3>
          ${prod.colorway ? `<div class="product-colorway-tag"><span class="color-dot"></span>${prod.colorway}</div>` : ''}

          <div class="product-footer-row">
            <div class="product-price-box">
              <span class="product-price">${formatVND(prod.price)}</span>
              ${prod.originalPrice ? `<span class="product-orig-price">${formatVND(prod.originalPrice)}</span>` : ""}
            </div>

            <button class="product-add-btn" data-id="${prod.id}" aria-label="Thêm vào giỏ hàng">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <span>Thêm</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join("");

  attachProductCardEvents();
}

function attachProductCardEvents() {
  document.querySelectorAll(".product-add-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const pid = btn.getAttribute("data-id");
      if (window.cartManager) {
        window.cartManager.addItem(pid, 1, true);

        const originalText = btn.innerHTML;
        btn.classList.add("added-success");
        btn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>Đã thêm!</span>
        `;
        setTimeout(() => {
          btn.classList.remove("added-success");
          btn.innerHTML = originalText;
        }, 1400);
      }
    });
  });

  document.querySelectorAll(".product-fav-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (window.cartManager) {
        const added = window.cartManager.toggleWishlist(btn.getAttribute("data-id"));
        btn.classList.toggle("active", added);
      }
    });
  });

  document.querySelectorAll(".product-quickview-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      openQuickView(btn.getAttribute("data-id"));
    });
  });
}

/**
 * Category & Sort Controls
 */
function initFilterAndSort() {
  const filterTabs = document.querySelectorAll(".filter-pill");
  const sortSelect = document.getElementById("product-sort-select");

  filterTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      filterTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      currentCategoryFilter = tab.getAttribute("data-category") || "all";
      renderProducts();
    });
  });

  sortSelect?.addEventListener("change", (e) => {
    currentSort = e.target.value;
    renderProducts();
  });
}

function filterByCategory(catId) {
  currentCategoryFilter = catId;
  document.querySelectorAll(".filter-pill").forEach(tab => {
    tab.classList.toggle("active", tab.getAttribute("data-category") === catId);
  });
  renderProducts();
}

function resetProductFilters() {
  currentCategoryFilter = "all";
  currentSearchQuery = "";
  currentSort = "featured";
  document.querySelectorAll(".filter-pill").forEach(t => t.classList.toggle("active", t.getAttribute("data-category") === "all"));
  const sortSelect = document.getElementById("product-sort-select");
  if (sortSelect) sortSelect.value = "featured";
  renderProducts();
}

/**
 * Discovery Section: "Hôm Nay Có Gì Hay?" – vòng lặp khám phá ngẫu nhiên
 */
function initDiscoveryRoulette() {
  const surpriseBtn = document.getElementById("discovery-surprise-btn");
  const heroSurpriseBtn = document.getElementById("hero-surprise-btn");
  const resultCard = document.getElementById("discovery-result-card");
  const loopGraphic = document.getElementById("discovery-loop-graphic");

  function triggerDiscovery() {
    if (!surpriseBtn || !resultCard) return;

    const discoverSection = document.getElementById("discover");
    if (discoverSection && window.scrollY < discoverSection.offsetTop - 300) {
      discoverSection.scrollIntoView({ behavior: "smooth" });
    }

    surpriseBtn.disabled = true;
    surpriseBtn.classList.add("spinning");
    loopGraphic?.classList.add("spinning-fast");

    let spinCount = 0;
    const interval = setInterval(() => {
      renderDiscoveryPreview(PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)], true);
      spinCount++;
      if (spinCount >= 12) {
        clearInterval(interval);
        finalizeDiscovery();
      }
    }, 120);

    function finalizeDiscovery() {
      const chosenProd = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
      renderDiscoveryPreview(chosenProd, false);

      surpriseBtn.disabled = false;
      surpriseBtn.classList.remove("spinning");
      loopGraphic?.classList.remove("spinning-fast");

      window.confettiEffect?.();
      window.cartManager?.showToast(`✨ Hôm nay có: ${chosenProd.name}! Giảm 10% với mã SURPRISE10`, "success");
    }
  }

  surpriseBtn?.addEventListener("click", triggerDiscovery);
  heroSurpriseBtn?.addEventListener("click", triggerDiscovery);

  renderDiscoveryPreview(PRODUCTS[13] || PRODUCTS[0], false); // Hộp quà khám phá
}

function renderDiscoveryPreview(prod, isShuffling) {
  const container = document.getElementById("discovery-result-card");
  if (!container) return;

  container.innerHTML = `
    <div class="discovery-card-inner ${isShuffling ? 'shuffling' : 'revealed'}">
      <div class="discovery-card-badge">
        <span class="loop-sparkle">🌀</span>
        ${isShuffling ? 'Đang quay vòng lặp khám phá...' : 'Tìm thấy món may mắn!'}
      </div>

      <div class="discovery-card-body">
        <div class="discovery-card-media">
          <img src="${prod.image}" alt="${prod.name}" class="discovery-img" />
          ${!isShuffling ? `<span class="discovery-tag-pill">${prod.categoryName}</span>` : ""}
        </div>

        <div class="discovery-card-content">
          <div class="discovery-rating">
            <span>★ ${String(prod.rating).replace(".", ",")}</span>
            <span class="muted">(${prod.reviewsCount} đánh giá)</span>
          </div>
          <h3 class="discovery-prod-title">${prod.name}</h3>
          ${prod.colorway ? `<div class="discovery-colorway-tag"><span class="color-dot"></span>${prod.colorway}</div>` : ''}
          <p class="discovery-prod-desc">${prod.description}</p>

          ${prod.curatorNote && !isShuffling ? `
            <div style="font-size: 0.82rem; color: var(--color-primary); background: var(--color-secondary-light); padding: 8px 12px; border-radius: var(--radius-sm); margin-bottom: 12px; border-left: 3px solid var(--color-secondary); font-style: italic;">
              💡 <strong>Vì sao đáng khám phá:</strong> “${prod.curatorNote}”
            </div>
          ` : ''}

          <div class="discovery-perk-box">
            <span class="perk-code">MÃ: <strong>SURPRISE10</strong></span>
            <span class="perk-note">Giảm 10% cho món may mắn này!</span>
          </div>

          <div class="discovery-price-row">
            <div class="discovery-price-block">
              <span class="discovery-current-price">${formatVND(prod.price)}</span>
              ${prod.originalPrice ? `<span class="discovery-old-price">${formatVND(prod.originalPrice)}</span>` : ""}
            </div>

            <div class="discovery-actions-group">
              <button class="btn btn-primary" onclick="cartManager.addItem('${prod.id}'); cartManager.applyCoupon('SURPRISE10'); cartManager.openCart();">
                Thêm vào giỏ
              </button>
              <button class="btn btn-outline btn-icon" onclick="document.getElementById('discovery-surprise-btn').click();" title="Quay lại">
                ↺ Quay lại
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Quick View Modal
 */
function initQuickViewModal() {
  const modal = document.getElementById("quickview-modal");
  const closeBtn = document.getElementById("quickview-close");
  const backdrop = document.getElementById("quickview-backdrop");

  function closeModal() {
    modal?.classList.remove("active");
    backdrop?.classList.remove("active");
    document.body.style.overflow = "";
  }

  closeBtn?.addEventListener("click", closeModal);
  backdrop?.addEventListener("click", closeModal);
}

function openQuickView(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const modal = document.getElementById("quickview-modal");
  const backdrop = document.getElementById("quickview-backdrop");
  const content = document.getElementById("quickview-modal-content");
  if (!modal || !content) return;

  const isFav = window.cartManager ? window.cartManager.isWishlisted(product.id) : false;

  content.innerHTML = `
    <div class="quickview-grid">
      <div class="quickview-gallery">
        <div class="quickview-main-image">
          <img src="${product.image}" alt="${product.name}" id="qv-main-img" />
          ${product.badge ? `<span class="quickview-pill-badge">${product.badge}</span>` : ""}
        </div>
      </div>

      <div class="quickview-details">
        <div class="quickview-category-row">
          <span class="quickview-category">${product.categoryName}</span>
          <div class="quickview-rating">
            <span class="star-icon">★</span>
            <span class="rating-num">${String(product.rating).replace(".", ",")}</span>
            <span class="reviews-count">(${product.reviewsCount} đánh giá)</span>
          </div>
        </div>

        <h2 class="quickview-title">${product.name}</h2>
        ${product.colorway ? `<div class="quickview-colorway-tag"><span class="color-dot"></span><strong>Màu sắc / Chất liệu:</strong> ${product.colorway}</div>` : ''}

        <div class="quickview-price-row">
          <span class="quickview-price">${formatVND(product.price)}</span>
          ${product.originalPrice ? `<span class="quickview-orig-price">${formatVND(product.originalPrice)}</span>` : ""}
          <span class="in-stock-badge">● Còn hàng, giao nhanh</span>
        </div>

        <p class="quickview-description">${product.description}</p>

        ${product.curatorNote ? `
          <div style="font-size: 0.88rem; color: var(--color-primary); background: var(--color-secondary-light); padding: 10px 16px; border-radius: var(--radius-md); margin-bottom: 20px; border-left: 3.5px solid var(--color-accent); font-style: italic;">
            💡 <strong>Vì sao đáng khám phá:</strong> “${product.curatorNote}”
          </div>
        ` : ''}

        <div class="quickview-features">
          <h4>Điểm nổi bật:</h4>
          <ul>
            ${product.features.map(f => `<li><span class="check-icon">✓</span> ${f}</li>`).join("")}
          </ul>
        </div>

        <div class="quickview-actions">
          <div class="qty-stepper large">
            <button class="qty-btn" id="qv-minus" aria-label="Giảm số lượng">−</button>
            <span class="qty-val" id="qv-qty">1</span>
            <button class="qty-btn" id="qv-plus" aria-label="Tăng số lượng">+</button>
          </div>

          <button class="btn btn-primary btn-large btn-flex" id="qv-add-to-cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            Thêm vào giỏ hàng
          </button>

          <button class="btn btn-outline btn-icon ${isFav ? 'active' : ''}" id="qv-fav-btn" title="Thêm vào yêu thích">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </button>
        </div>

        <div class="quickview-perks-row">
          <div class="perk-pill">🚚 Freeship toàn quốc từ 299.000₫</div>
          <div class="perk-pill">🔁 Đổi trả trong 7 ngày</div>
          <div class="perk-pill">✨ Chọn lọc kỹ lưỡng</div>
        </div>
      </div>
    </div>
  `;

  let currentQty = 1;
  const qtyEl = document.getElementById("qv-qty");
  document.getElementById("qv-minus")?.addEventListener("click", () => {
    if (currentQty > 1) {
      currentQty--;
      if (qtyEl) qtyEl.textContent = currentQty;
    }
  });
  document.getElementById("qv-plus")?.addEventListener("click", () => {
    currentQty++;
    if (qtyEl) qtyEl.textContent = currentQty;
  });

  document.getElementById("qv-add-to-cart")?.addEventListener("click", () => {
    if (window.cartManager) {
      window.cartManager.addItem(product.id, currentQty, true);
      modal.classList.remove("active");
      backdrop?.classList.remove("active");
      document.body.style.overflow = "";
      window.cartManager.openCart();
    }
  });

  const favBtn = document.getElementById("qv-fav-btn");
  favBtn?.addEventListener("click", () => {
    if (window.cartManager) {
      const added = window.cartManager.toggleWishlist(product.id);
      favBtn.classList.toggle("active", added);
    }
  });

  modal.classList.add("active");
  backdrop?.classList.add("active");
  document.body.style.overflow = "hidden";
}

/**
 * Instant Search Modal (tìm kiếm không dấu)
 */
function initSearchModal() {
  const searchTrigger = document.getElementById("header-search-btn");
  const modal = document.getElementById("search-modal");
  const closeBtn = document.getElementById("search-modal-close");
  const backdrop = document.getElementById("search-modal-backdrop");
  const input = document.getElementById("search-modal-input");
  const resultsContainer = document.getElementById("search-modal-results");
  const tags = document.querySelectorAll(".search-tag-chip");

  function openSearch() {
    modal?.classList.add("active");
    backdrop?.classList.add("active");
    document.body.style.overflow = "hidden";
    setTimeout(() => input?.focus(), 150);
  }

  function closeSearch() {
    modal?.classList.remove("active");
    backdrop?.classList.remove("active");
    document.body.style.overflow = "";
  }

  searchTrigger?.addEventListener("click", openSearch);
  closeBtn?.addEventListener("click", closeSearch);
  backdrop?.addEventListener("click", closeSearch);

  input?.addEventListener("input", (e) => {
    const raw = e.target.value.trim();
    if (raw.length === 0) {
      resultsContainer.innerHTML = `<p class="search-hint">Gõ để tìm sản phẩm, hoặc chọn một từ khóa đang hot bên trên.</p>`;
      return;
    }

    const matches = PRODUCTS.filter(p => productMatches(p, raw));

    if (matches.length === 0) {
      resultsContainer.innerHTML = `<div class="search-empty">Không tìm thấy sản phẩm nào cho "<strong>${escapeHTML(raw)}</strong>". Thử từ khóa khác nhé!</div>`;
    } else {
      resultsContainer.innerHTML = `
        <div class="search-results-grid">
          ${matches.map(p => `
            <div class="search-result-item" onclick="closeSearch(); openQuickView('${p.id}');">
              <img src="${p.image}" alt="${p.name}" class="search-item-thumb" />
              <div class="search-item-info">
                <span class="search-item-cat">${p.categoryName}</span>
                <h4 class="search-item-title">${p.name}</h4>
                <div class="search-item-price">${formatVND(p.price)}</div>
              </div>
            </div>
          `).join("")}
        </div>
      `;
    }
  });

  tags.forEach(tag => {
    tag.addEventListener("click", () => {
      if (input) {
        input.value = tag.textContent.trim();
        input.dispatchEvent(new Event("input"));
      }
    });
  });

  window.closeSearch = closeSearch;
}

/**
 * Newsletter Section
 */
function initNewsletter() {
  const form = document.getElementById("newsletter-form");
  const input = document.getElementById("newsletter-email");
  const submitBtn = document.getElementById("newsletter-submit");

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = input?.value.trim();

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      window.cartManager?.showToast("Vui lòng nhập địa chỉ email hợp lệ.", "error");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Đang đăng ký...</span>`;

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<span>✓ Đã đăng ký!</span>`;
      submitBtn.classList.add("btn-success");

      window.cartManager?.showToast(`🎉 Chào mừng bạn đến với LOOPI! Dùng mã "LOOPI15" để giảm 15%.`, "success");
      window.confettiEffect?.();

      const note = document.getElementById("newsletter-success-note");
      if (note) note.style.display = "block";

      if (input) input.value = "";
    }, 800);
  });
}

/**
 * Checkout Success Modal
 */
function initCheckoutModal() {
  const modal = document.getElementById("checkout-success-modal");
  const closeBtn = document.getElementById("checkout-modal-close");
  const backdrop = document.getElementById("checkout-modal-backdrop");
  const continueBtn = document.getElementById("checkout-continue-btn");

  function closeModal() {
    modal?.classList.remove("active");
    backdrop?.classList.remove("active");
    document.body.style.overflow = "";
  }

  closeBtn?.addEventListener("click", closeModal);
  backdrop?.addEventListener("click", closeModal);
  continueBtn?.addEventListener("click", closeModal);
}

/**
 * Confetti
 */
function initCanvasConfetti() {
  window.confettiEffect = function () {
    const count = 75;
    const colors = ["#3E9579", "#E597C1", "#D4DBDE", "#EFC7DC", "#327A63"];

    for (let i = 0; i < count; i++) {
      const confetti = document.createElement("div");
      confetti.className = "celebration-particle";
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

      const size = Math.random() * 8 + 6;
      confetti.style.width = `${size}px`;
      confetti.style.height = `${size * (Math.random() > 0.5 ? 1.5 : 1)}px`;
      confetti.style.left = `${Math.random() * 100}vw`;
      confetti.style.top = `-20px`;
      confetti.style.opacity = Math.random() + 0.5;
      confetti.style.transform = `rotate(${Math.random() * 360}deg)`;

      const duration = Math.random() * 2 + 1.8;
      confetti.style.animation = `confettiFall ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`;

      document.body.appendChild(confetti);
      setTimeout(() => confetti.remove(), duration * 1000);
    }
  };
}

/**
 * Scroll Reveal Animations
 */
function initScrollEffects() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("in-view");
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(".reveal-on-scroll").forEach(el => observer.observe(el));
}

/**
 * Promotional Cinematic Video & Shot 01 Controller (LoopiPromo)
 * Hỗ trợ chuyển đổi giữa Shot 01 (The Reveal - 5s) và Full Film (24s).
 * Tự động phát khi cuộn vào viewport, hỗ trợ Web Audio cinematic swell/chime cho Shot 01.
 */
function initPromoVideo() {
  const video = document.getElementById("loopi-promo-video");
  const playBtn = document.getElementById("promo-play-btn");
  const replayBtn = document.getElementById("promo-replay-btn");
  const soundBtn = document.getElementById("promo-sound-btn");
  const tabs = document.querySelectorAll(".promo-shot-tab");
  const sectionBadge = document.getElementById("promo-section-badge");
  const pillText = document.getElementById("promo-pill-text");
  const qualityBadge = document.getElementById("promo-quality-badge");
  const captionTitle = document.getElementById("promo-caption-title");

  if (!video) return;

  const iconPlay = playBtn?.querySelector(".icon-play");
  const iconPause = playBtn?.querySelector(".icon-pause");
  const iconSound = soundBtn?.querySelector(".icon-sound");
  const iconMuted = soundBtn?.querySelector(".icon-muted");

  let currentShot = "full";
  let audioCtx = null;

  // Web Audio Synth for Shot 01 & Shot 02 cinematic soundscapes
  function playCinematicShotSound() {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      if (!audioCtx) audioCtx = new AudioContextClass();
      if (audioCtx.state === "suspended") audioCtx.resume();

      const now = audioCtx.currentTime;

      if (currentShot === "shot01") {
        // 1. Warm Sub Bass Swell
        const osc1 = audioCtx.createOscillator();
        const gain1 = audioCtx.createGain();
        osc1.type = "sine";
        osc1.frequency.setValueAtTime(65, now);
        osc1.frequency.exponentialRampToValueAtTime(110, now + 2.2);

        gain1.gain.setValueAtTime(0.001, now);
        gain1.gain.linearRampToValueAtTime(0.25, now + 1.8);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 4.5);

        osc1.connect(gain1);
        gain1.connect(audioCtx.destination);
        osc1.start(now);
        osc1.stop(now + 4.8);

        // 2. Soft airy whoosh around 1.2s - 2.8s
        const bufferSize = audioCtx.sampleRate * 2;
        const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }
        const whiteNoise = audioCtx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;

        const filter = audioCtx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(400, now + 1.0);
        filter.frequency.exponentialRampToValueAtTime(1600, now + 2.2);
        filter.Q.setValueAtTime(3.0, now + 1.0);

        const noiseGain = audioCtx.createGain();
        noiseGain.gain.setValueAtTime(0.001, now + 1.0);
        noiseGain.gain.linearRampToValueAtTime(0.12, now + 2.0);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 3.2);

        whiteNoise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(audioCtx.destination);
        whiteNoise.start(now + 1.0);
        whiteNoise.stop(now + 3.3);

        // 3. Crystal Chime Sparkle at 2.2s
        const chimeFreqs = [1046.5, 1567.98, 2093.0];
        chimeFreqs.forEach((freq, idx) => {
          const chimeOsc = audioCtx.createOscillator();
          const chimeGain = audioCtx.createGain();
          chimeOsc.type = "sine";
          chimeOsc.frequency.setValueAtTime(freq, now + 2.1 + idx * 0.04);

          chimeGain.gain.setValueAtTime(0.001, now + 2.1 + idx * 0.04);
          chimeGain.gain.linearRampToValueAtTime(0.08 / (idx + 1), now + 2.15 + idx * 0.04);
          chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 4.2 + idx * 0.04);

          chimeOsc.connect(chimeGain);
          chimeGain.connect(audioCtx.destination);
          chimeOsc.start(now + 2.1 + idx * 0.04);
          chimeOsc.stop(now + 4.5);
        });
      } else if (currentShot === "shot02") {
        // Shot 02 Macro Discovery Audio:
        // A. Camera pull-back airy whoosh
        const bufferSize = audioCtx.sampleRate * 2.5;
        const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }
        const whiteNoise = audioCtx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;

        const filter = audioCtx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(800, now);
        filter.frequency.exponentialRampToValueAtTime(2800, now + 1.8);
        filter.frequency.exponentialRampToValueAtTime(400, now + 3.2);

        const noiseGain = audioCtx.createGain();
        noiseGain.gain.setValueAtTime(0.001, now);
        noiseGain.gain.linearRampToValueAtTime(0.10, now + 1.2);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 3.0);

        whiteNoise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(audioCtx.destination);
        whiteNoise.start(now);
        whiteNoise.stop(now + 3.2);

        // B. Subtle tactile click / acoustic resonance at full reveal (2.2s)
        const clickOsc = audioCtx.createOscillator();
        const clickGain = audioCtx.createGain();
        clickOsc.type = "triangle";
        clickOsc.frequency.setValueAtTime(440, now + 2.1);
        clickOsc.frequency.exponentialRampToValueAtTime(220, now + 2.25);

        clickGain.gain.setValueAtTime(0.001, now + 2.1);
        clickGain.gain.linearRampToValueAtTime(0.14, now + 2.12);
        clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);

        clickOsc.connect(clickGain);
        clickGain.connect(audioCtx.destination);
        clickOsc.start(now + 2.1);
        clickOsc.stop(now + 2.45);

        // C. Warm harmonic discovery pad holding until 4.8s
        const padOsc = audioCtx.createOscillator();
        const padGain = audioCtx.createGain();
        padOsc.type = "sine";
        padOsc.frequency.setValueAtTime(329.63, now + 1.8); // E4
        padGain.gain.setValueAtTime(0.001, now + 1.8);
        padGain.gain.linearRampToValueAtTime(0.09, now + 2.4);
        padGain.gain.exponentialRampToValueAtTime(0.001, now + 4.8);

        padOsc.connect(padGain);
        padGain.connect(audioCtx.destination);
        padOsc.start(now + 1.8);
        padOsc.stop(now + 4.9);
      } else if (currentShot === "shot03") {
        // Shot 03 Store Journey: continuous forward movement, subtle whooshes
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(110, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 3.5);
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.12, now + 1.5);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 4.8);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 4.9);
      } else if (currentShot === "shot04") {
        // Shot 04 The Discovery Loop:
        // A. Smooth circular whoosh synchronized with orbit
        const bufferSize = audioCtx.sampleRate * 3.0;
        const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }
        const whiteNoise = audioCtx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;

        const filter = audioCtx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(500, now);
        filter.frequency.exponentialRampToValueAtTime(2200, now + 2.2);
        filter.frequency.exponentialRampToValueAtTime(600, now + 4.2);
        filter.Q.setValueAtTime(2.5, now);

        const noiseGain = audioCtx.createGain();
        noiseGain.gain.setValueAtTime(0.001, now);
        noiseGain.gain.linearRampToValueAtTime(0.15, now + 2.0);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 4.5);

        whiteNoise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(audioCtx.destination);
        whiteNoise.start(now);
        whiteNoise.stop(now + 4.6);

        // B. Subtle rising musical tone into second product reveal (2.4s)
        const riseOsc = audioCtx.createOscillator();
        const riseGain = audioCtx.createGain();
        riseOsc.type = "sine";
        riseOsc.frequency.setValueAtTime(261.63, now + 0.8); // C4
        riseOsc.frequency.exponentialRampToValueAtTime(523.25, now + 2.4); // C5
        riseGain.gain.setValueAtTime(0.001, now + 0.8);
        riseGain.gain.linearRampToValueAtTime(0.12, now + 2.2);
        riseGain.gain.exponentialRampToValueAtTime(0.001, now + 4.2);
        riseOsc.connect(riseGain);
        riseGain.connect(audioCtx.destination);
        riseOsc.start(now + 0.8);
        riseOsc.stop(now + 4.3);

        // C. Crystalline chime at second product arrival (2.4s)
        const chime = audioCtx.createOscillator();
        const chimeG = audioCtx.createGain();
        chime.type = "sine";
        chime.frequency.setValueAtTime(1318.51, now + 2.4); // E6
        chimeG.gain.setValueAtTime(0.001, now + 2.4);
        chimeG.gain.linearRampToValueAtTime(0.10, now + 2.44);
        chimeG.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);
        chime.connect(chimeG);
        chimeG.connect(audioCtx.destination);
        chime.start(now + 2.4);
        chime.stop(now + 4.6);
      } else if (currentShot === "shot05") {
        // Shot 05 Moment of Delight:
        // A. Subtle room air ambience & gentle fabric movement
        const bufferSize = audioCtx.sampleRate * 3.0;
        const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }
        const whiteNoise = audioCtx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;

        const filter = audioCtx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(600, now);
        filter.frequency.exponentialRampToValueAtTime(1800, now + 2.2);
        filter.frequency.exponentialRampToValueAtTime(500, now + 4.2);

        const noiseGain = audioCtx.createGain();
        noiseGain.gain.setValueAtTime(0.001, now);
        noiseGain.gain.linearRampToValueAtTime(0.08, now + 1.8);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 4.4);

        whiteNoise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(audioCtx.destination);
        whiteNoise.start(now);
        whiteNoise.stop(now + 4.5);

        // B. Tactile pickup click / material resonance (2.2s)
        const clickOsc = audioCtx.createOscillator();
        const clickGain = audioCtx.createGain();
        clickOsc.type = "triangle";
        clickOsc.frequency.setValueAtTime(520, now + 2.15);
        clickOsc.frequency.exponentialRampToValueAtTime(260, now + 2.3);
        clickGain.gain.setValueAtTime(0.001, now + 2.15);
        clickGain.gain.linearRampToValueAtTime(0.12, now + 2.18);
        clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.45);
        clickOsc.connect(clickGain);
        clickGain.connect(audioCtx.destination);
        clickOsc.start(now + 2.15);
        clickOsc.stop(now + 2.5);

        // C. Warm optimistic acoustic chord progression (G - C)
        const chordNotes = [392.00, 493.88, 587.33]; // G4, B4, D5
        chordNotes.forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const g = audioCtx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now + 2.0 + idx * 0.05);
          g.gain.setValueAtTime(0.001, now + 2.0 + idx * 0.05);
          g.gain.linearRampToValueAtTime(0.06 / (idx + 1), now + 2.4 + idx * 0.05);
          g.gain.exponentialRampToValueAtTime(0.0001, now + 4.8);
          osc.connect(g);
          g.connect(audioCtx.destination);
          osc.start(now + 2.0 + idx * 0.05);
          osc.stop(now + 4.9);
        });
      } else if (currentShot === "shot06") {
        // Shot 06 Finale - Things Worth Finding:
        // A. Gentle emotional peak swell
        const swell = audioCtx.createOscillator();
        const swellG = audioCtx.createGain();
        swell.type = "sine";
        swell.frequency.setValueAtTime(130.81, now); // C3
        swell.frequency.exponentialRampToValueAtTime(261.63, now + 2.8); // C4
        swellG.gain.setValueAtTime(0.001, now);
        swellG.gain.linearRampToValueAtTime(0.14, now + 2.2);
        swellG.gain.exponentialRampToValueAtTime(0.0001, now + 4.2);
        swell.connect(swellG);
        swellG.connect(audioCtx.destination);
        swell.start(now);
        swell.stop(now + 4.3);

        // B. Soft airy circular orbit whoosh (0.0s - 2.8s)
        const bufferSize = audioCtx.sampleRate * 2.8;
        const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }
        const whiteNoise = audioCtx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;

        const filter = audioCtx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(500, now);
        filter.frequency.exponentialRampToValueAtTime(1800, now + 1.8);
        filter.frequency.exponentialRampToValueAtTime(400, now + 3.0);
        filter.Q.setValueAtTime(2.0, now);

        const noiseGain = audioCtx.createGain();
        noiseGain.gain.setValueAtTime(0.001, now);
        noiseGain.gain.linearRampToValueAtTime(0.10, now + 1.6);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 3.2);

        whiteNoise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(audioCtx.destination);
        whiteNoise.start(now);
        whiteNoise.stop(now + 3.3);

        // C. Crystalline sparkle chime at Logo Reveal (3.0s)
        const logoChimes = [1046.5, 1318.51, 1567.98, 2093.0]; // C6, E6, G6, C7
        logoChimes.forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const g = audioCtx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now + 2.9 + idx * 0.04);
          g.gain.setValueAtTime(0.001, now + 2.9 + idx * 0.04);
          g.gain.linearRampToValueAtTime(0.08 / (idx + 1), now + 2.95 + idx * 0.04);
          g.gain.exponentialRampToValueAtTime(0.0001, now + 4.6);
          osc.connect(g);
          g.connect(audioCtx.destination);
          osc.start(now + 2.9 + idx * 0.04);
          osc.stop(now + 4.8);
        });
      }
    } catch (e) {
      console.warn("Audio synthesis notice:", e);
    }
  }

  // Switch between Shot 01, Shot 02, Shot 03, Shot 04, Shot 05, Shot 06, and Full Film
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");

      const videoSrc = tab.getAttribute("data-video-src");
      const poster = tab.getAttribute("data-poster");
      const tag = tab.getAttribute("data-tag");
      const fps = tab.getAttribute("data-fps");
      const title = tab.getAttribute("data-title");
      const badge = tab.getAttribute("data-section-badge");

      if (tab.id === "tab-shot-01") currentShot = "shot01";
      else if (tab.id === "tab-shot-02") currentShot = "shot02";
      else if (tab.id === "tab-shot-03") currentShot = "shot03";
      else if (tab.id === "tab-shot-04") currentShot = "shot04";
      else if (tab.id === "tab-shot-05") currentShot = "shot05";
      else if (tab.id === "tab-shot-06") currentShot = "shot06";
      else currentShot = "full";

      if (sectionBadge && badge) sectionBadge.textContent = badge;
      if (pillText && tag) pillText.textContent = tag;
      if (qualityBadge && fps) qualityBadge.textContent = fps;
      if (captionTitle && title) captionTitle.textContent = title;

      if (video.src !== videoSrc) {
        const wasPaused = video.paused;
        video.src = videoSrc;
        if (poster) video.poster = poster;
        video.currentTime = 0;
        video.load();

        if (!wasPaused) {
          video.play().catch(() => {});
          if (!video.muted && currentShot.startsWith("shot")) {
            playCinematicShotSound();
          }
        }
      }
    });
  });

  // Replay Button
  replayBtn?.addEventListener("click", () => {
    video.currentTime = 0;
    video.play().then(() => {
      if (iconPlay) iconPlay.style.display = "none";
      if (iconPause) iconPause.style.display = "block";
      if (!video.muted && currentShot.startsWith("shot")) {
        playCinematicShotSound();
      }
    }).catch(() => {});
  });

  // Play / Pause toggle
  playBtn?.addEventListener("click", () => {
    if (video.paused) {
      video.play().then(() => {
        if (iconPlay) iconPlay.style.display = "none";
        if (iconPause) iconPause.style.display = "block";
        if (!video.muted && currentShot.startsWith("shot")) {
          playCinematicShotSound();
        }
      }).catch(() => {});
    } else {
      video.pause();
      if (iconPlay) iconPlay.style.display = "block";
      if (iconPause) iconPause.style.display = "none";
    }
  });

  // Sound toggle
  soundBtn?.addEventListener("click", () => {
    video.muted = !video.muted;
    if (video.muted) {
      if (iconSound) iconSound.style.display = "none";
      if (iconMuted) iconMuted.style.display = "block";
    } else {
      video.volume = 1.0;
      if (iconSound) iconSound.style.display = "block";
      if (iconMuted) iconMuted.style.display = "none";
      if (currentShot.startsWith("shot")) {
        playCinematicShotSound();
      }
    }
  });

  // Loop trigger event
  video.addEventListener("seeked", () => {
    if (video.currentTime < 0.3 && !video.muted && currentShot.startsWith("shot")) {
      playCinematicShotSound();
    }
  });

  // Auto-pause / resume based on visibility (saves mobile CPU & data)
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          video.play().then(() => {
            if (iconPlay) iconPlay.style.display = "none";
            if (iconPause) iconPause.style.display = "block";
          }).catch(() => {});
        } else {
          if (!video.paused) {
            video.pause();
            if (iconPlay) iconPlay.style.display = "block";
            if (iconPause) iconPause.style.display = "none";
          }
        }
      });
    }, { threshold: 0.25 });

    observer.observe(video);
  }
}