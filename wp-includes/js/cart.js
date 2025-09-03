function addToCart(event) {
  let name = document.querySelector(".product_title")?.innerText.trim();

  let priceText = document.querySelector(".price .amount bdi")?.innerText || "0";
  let price = parseInt(priceText.replace(/\D/g, ""));

  let qtyInput = document.querySelector("form.cart input[type='number']");
  let quantity = parseInt(qtyInput?.value) || 1;

  let imgEl = document.querySelector(".woocommerce-product-gallery__wrapper .woocommerce-product-gallery__image img");
  let img = imgEl ? (imgEl.dataset.large_image || imgEl.src) : "https://via.placeholder.com/300";

  let url = window.location.href;

  if (!name || !price) {
    alert("Không lấy được thông tin sản phẩm!");
    return false;
  }

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let existingItem = cart.find(item => item.name === name);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ name, price, quantity, img, url });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

function loadCart() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let cartWidget = document.getElementsByClassName("widget_shopping_cart_content")[0];

  let html = "";

  if (cart.length) {
    html += `<ul class="woocommerce-mini-cart cart_list product_list_widget">`;

    cart.forEach((item, index) => {
      let subtotal = item.price * item.quantity;

      html += `
        <li class="woocommerce-mini-cart-item mini_cart_item">
          <a href="#" class="remove remove_from_cart_button" aria-label="Xóa ${item.name} khỏi giỏ hàng"
             onclick="removeItem(${index})">×</a>
          <a href="${item.url}">
            <img width="300" height="300" src="${item.img}"
                 class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" decoding="async" loading="lazy">
            ${item.name}
          </a>
          <div class="ux-mini-cart-qty">
            <span class="quantity">
              ${item.quantity} ×
              <span class="woocommerce-Price-amount amount">
                <bdi>${item.price.toLocaleString()}&nbsp;<span class="woocommerce-Price-currencySymbol">₫</span></bdi>
              </span>
            </span>
          </div>
        </li>
      `;
    });

    html += `</ul>`;

    let total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    html += `
      <div class="ux-mini-cart-footer">
        <p class="woocommerce-mini-cart__total total">
          <strong>Tổng số phụ:</strong>
          <span class="woocommerce-Price-amount amount">
            <bdi>${total.toLocaleString()}&nbsp;<span class="woocommerce-Price-currencySymbol">₫</span></bdi>
          </span>
        </p>
        <p class="woocommerce-mini-cart__buttons buttons">
          <a href="/gio-hang/" class="button wc-forward">Xem giỏ hàng</a>
          <a href="/thanh-toan/" class="button checkout wc-forward">Thanh toán</a>
        </p>
      </div>
    `;
  } else {
    html = `<p class="woocommerce-mini-cart__empty-message">Chưa có sản phẩm nào trong giỏ.</p>`;
  }

  if (cartWidget) cartWidget.innerHTML = html;
}

function removeItem(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

function checkout() {
  localStorage.removeItem("cart");
  loadCart();
}

window.onload = loadCart;
