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
  renderCartWoo();
}

function loadCart() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let cartWidget = document.getElementsByClassName("widget_shopping_cart_content")[0];
  let cartWidget2 = document.getElementsByClassName("widget_shopping_cart_content")[1];

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
  if (cartWidget2) cartWidget2.innerHTML = html;

  let totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  let basketIcon = document.querySelectorAll(".icon-shopping-basket")[0];
  let basketIcon2 = document.querySelectorAll(".icon-shopping-basket")[1];
  if (basketIcon) {
    basketIcon.setAttribute("data-icon-label", totalQuantity);
  }
  if (basketIcon2) {
    basketIcon2.setAttribute("data-icon-label", totalQuantity);
  }
}

function removeItem(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
  renderCartWoo();
}

function checkout() {
  localStorage.removeItem("cart");
  loadCart();
  renderCartWoo();
  renderCheckout();
}

function renderCartWoo() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let woocommerceContainer = document.querySelector(".woocommerce");
  let shippingFee = 30000;

  if (!woocommerceContainer) return;

  if (cart.length === 0) {
    woocommerceContainer.innerHTML = `
      <div class="text-center pt pb">
        <div class="woocommerce-notices-wrapper"></div>
        <div class="wc-empty-cart-message"></div>
        <p class="return-to-shop">
          <a class="button primary wc-backward" href="/">
            Quay trở lại cửa hàng
          </a>
        </p>
      </div>
    `;
    return;
  }

  let cartWrapper = document.querySelector(".woocommerce-cart-form .cart-wrapper");
  let cartTotals = document.querySelector(".cart_totals");

  if (!cartWrapper || !cartTotals) return;

  let cartItemsHtml = `
    <table class="shop_table shop_table_responsive cart woocommerce-cart-form__contents" cellspacing="0">
      <thead>
        <tr>
          <th class="product-name" colspan="3">Sản phẩm</th>
          <th class="product-price">Giá</th>
          <th class="product-quantity">Số lượng</th>
          <th class="product-subtotal">Tạm tính</th>
        </tr>
      </thead>
      <tbody>
  `;

  cart.forEach((item, index) => {
    let itemSubtotal = item.price * item.quantity;
    let productId = `item_${index}`;

    cartItemsHtml += `
      <tr class="woocommerce-cart-form__cart-item cart_item">
        <td class="product-remove">
          <a href="#" class="remove" aria-label="Xóa ${item.name} khỏi giỏ hàng" data-product_id="${productId}" data-index="${index}">×</a>
        </td>
        <td class="product-thumbnail">
          <a href="${item.url}">
            <img width="300" height="300" src="${item.img}" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="${item.name}">
          </a>
        </td>
        <td class="product-name" data-title="Sản phẩm">
          <a href="${item.url}">${item.name}</a>
          <div class="show-for-small mobile-product-price">
            <span class="mobile-product-price__qty">${item.quantity} x </span>
            <span class="woocommerce-Price-amount amount"><bdi>${item.price.toLocaleString()}&nbsp;<span class="woocommerce-Price-currencySymbol">₫</span></bdi></span>
          </div>
        </td>
        <td class="product-price" data-title="Giá">
          <span class="woocommerce-Price-amount amount"><bdi>${item.price.toLocaleString()}&nbsp;<span class="woocommerce-Price-currencySymbol">₫</span></bdi></span>
        </td>
        <td class="product-quantity" data-title="Số lượng">
          <div class="ux-quantity quantity buttons_added">
            <input type="button" value="-" class="ux-quantity__button ux-quantity__button--minus button minus is-form">
            <label class="screen-reader-text" for="quantity_${productId}">${item.name} số lượng</label>
            <input type="number" id="quantity_${productId}" class="input-text qty text" name="cart[${productId}][qty]" value="${item.quantity}" aria-label="Số lượng sản phẩm" min="0" step="1" data-index="${index}">
            <input type="button" value="+" class="ux-quantity__button ux-quantity__button--plus button plus is-form">
          </div>
        </td>
        <td class="product-subtotal" data-title="Tạm tính">
          <span class="woocommerce-Price-amount amount"><bdi>${itemSubtotal.toLocaleString()}&nbsp;<span class="woocommerce-Price-currencySymbol">₫</span></bdi></span>
        </td>
      </tr>
    `;
  });

  cartItemsHtml += `
    <tr>
      <td colspan="6" class="actions clear">
        <div class="continue-shopping pull-left text-left">
          <a class="button-continue-shopping button primary is-outline" href="/">←&nbsp;Tiếp tục xem sản phẩm</a>
        </div>
        <button type="submit" class="button primary mt-0 pull-left small" name="update_cart" value="Cập nhật giỏ hàng">Cập nhật giỏ hàng</button>
        <input type="hidden" id="woocommerce-cart-nonce" name="woocommerce-cart-nonce" value="dfec8ee7dc">
        <input type="hidden" name="_wp_http_referer" value="/gio-hang/">
      </td>
    </tr>
  </tbody>
</table>`;
  cartWrapper.innerHTML = cartItemsHtml;

  let subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  let total = subtotal + shippingFee;

  let cartTotalsHtml = `
    <table cellspacing="0">
      <thead>
        <tr>
          <th class="product-name" colspan="2">Tổng cộng giỏ hàng</th>
        </tr>
      </thead>
    </table>
    <h2>Tổng cộng giỏ hàng</h2>
    <table cellspacing="0" class="shop_table shop_table_responsive">
      <tbody>
        <tr class="cart-subtotal">
          <th>Tạm tính</th>
          <td data-title="Tạm tính"><span class="woocommerce-Price-amount amount"><bdi>${subtotal.toLocaleString()}&nbsp;<span class="woocommerce-Price-currencySymbol">₫</span></bdi></span></td>
        </tr>
        <tr class="woocommerce-shipping-totals shipping">
          <td class="shipping__inner" colspan="2">
            <table class="shipping__table">
              <tbody>
                <tr>
                  <th>Giao hàng</th>
                  <td data-title="Giao hàng">
                    <ul id="shipping_method" class="shipping__list woocommerce-shipping-methods">
                      <li class="shipping__list_item">
                        <input type="hidden" name="shipping_method[0]" data-index="0" id="shipping_method_0_flat_rate2" value="flat_rate:2" class="shipping_method">
                        <label class="shipping__list_label" for="shipping_method_0_flat_rate2">Đồng giá: <span class="woocommerce-Price-amount amount"><bdi>${shippingFee.toLocaleString()}&nbsp;<span class="woocommerce-Price-currencySymbol">₫</span></bdi></span></label>
                      </li>
                    </ul>
                    <p class="woocommerce-shipping-destination">Tùy chọn giao hàng sẽ được cập nhật trong quá trình thanh toán.</p>
                    <form class="woocommerce-shipping-calculator" action="/gio-hang/" method="post">
                      <a href="#" class="shipping-calculator-button" aria-expanded="false" aria-controls="shipping-calculator-form" role="button">Tính phí giao hàng</a>
                      <section class="shipping-calculator-form" id="shipping-calculator-form" style="display:none;">
                        <p class="form-row form-row-wide" id="calc_shipping_country_field">
                          <label for="calc_shipping_country" class="screen-reader-text">Quốc gia / Khu vực:</label>
                          <select name="calc_shipping_country" id="calc_shipping_country" class="country_to_state country_select" rel="calc_shipping_state">
                            <option value="default">Chọn Quốc gia/Khu vực…</option>
                            <option value="VN" selected="selected">Việt Nam</option>
                          </select>
                        </p>
                        <p class="form-row form-row-wide address-field" id="calc_shipping_city_field">
                          <label for="calc_shipping_city" class="screen-reader-text">Thị trấn / Thành phố&nbsp;<abbr class="required" title="bắt buộc">*</abbr></label>
                          <input type="text" class="input-text" value="" placeholder="Thị trấn / Thành phố" name="calc_shipping_city" id="calc_shipping_city" data-placeholder="Thị trấn / Thành phố">
                        </p>
                        <p class="form-row form-row-wide address-field" id="calc_shipping_postcode_field">
                          <label for="calc_shipping_postcode" class="screen-reader-text">Mã bưu điện&nbsp;<span class="optional">(tuỳ chọn)</span></label>
                          <input type="text" class="input-text" value="" placeholder="Mã bưu điện" name="calc_shipping_postcode" id="calc_shipping_postcode" data-placeholder="Mã bưu điện">
                        </p>
                        <p><button type="submit" name="calc_shipping" value="1" class="button">Cập nhật</button></p>
                        <input type="hidden" id="woocommerce-shipping-calculator-nonce" name="woocommerce-shipping-calculator-nonce" value="a0a8f69750">
                        <input type="hidden" name="_wp_http_referer" value="/gio-hang/">
                      </section>
                    </form>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
        <tr class="order-total">
          <th>Tổng</th>
          <td data-title="Tổng"><strong><span class="woocommerce-Price-amount amount"><bdi>${total.toLocaleString()}&nbsp;<span class="woocommerce-Price-currencySymbol">₫</span></bdi></span></strong></td>
        </tr>
      </tbody>
    </table>
    <div class="wc-proceed-to-checkout">
      <a href="/thanh-toan/" class="checkout-button button alt wc-forward">Tiến hành thanh toán</a>
    </div>
    <form class="ux-cart-coupon mb-0" method="post">
      <div class="coupon">
        <h3 class="widget-title"><i class="icon-tag"></i> Mã ưu đãi</h3>
        <label for="coupon_code" class="screen-reader-text">Ưu đãi:</label>
        <input type="text" name="coupon_code" class="input-text" id="coupon_code" value="" placeholder="Mã ưu đãi">
        <button type="submit" class="is-form expand button" name="apply_coupon" value="Áp dụng">Áp dụng</button>
      </div>
    </form>
  `;

  woocommerceContainer.innerHTML = `
    <div class="woocommerce-notices-wrapper"></div>
    <div class="woocommerce row row-large row-divided">
      <div class="col large-7 pb-0">
        <form class="woocommerce-cart-form" action="/gio-hang/" method="post">
          <div class="cart-wrapper sm-touch-scroll">
            ${cartItemsHtml}
          </div>
        </form>
      </div>
      <div class="cart-collaterals large-5 col pb-0">
        <div class="cart-sidebar col-inner">
          ${cartTotalsHtml}
        </div>
      </div>
    </div>
    <div class="cart-footer-content after-cart-content relative"></div>
  `;

  document.querySelectorAll(".remove").forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      let idx = parseInt(btn.dataset.index);
      cart.splice(idx, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      loadCart();
      renderCartWoo();
    });
  });

  document.querySelectorAll(".qty").forEach(input => {
    input.addEventListener("change", e => {
      let idx = parseInt(input.dataset.index);
      let qty = parseInt(input.value);
      if (qty < 1) qty = 1;
      cart[idx].quantity = qty;
      localStorage.setItem("cart", JSON.stringify(cart));
      loadCart();
      renderCartWoo();
    });
  });

  document.querySelectorAll(".ux-quantity__button--minus").forEach(btn => {
    btn.addEventListener("click", e => {
      let input = btn.nextElementSibling.nextElementSibling;
      let idx = parseInt(input.dataset.index);
      let qty = parseInt(input.value) - 1;
      if (qty < 1) qty = 1;
      cart[idx].quantity = qty;
      localStorage.setItem("cart", JSON.stringify(cart));
      loadCart();
      renderCartWoo();
    });
  });

  document.querySelectorAll(".ux-quantity__button--plus").forEach(btn => {
    btn.addEventListener("click", e => {
      let input = btn.previousElementSibling;
      let idx = parseInt(input.dataset.index);
      let qty = parseInt(input.value) + 1;
      cart[idx].quantity = qty;
      localStorage.setItem("cart", JSON.stringify(cart));
      loadCart();
      renderCartWoo();
    });
  });

  document.querySelector('button[name="update_cart"]')?.addEventListener("click", e => {
    e.preventDefault();
    loadCart();
    renderCartWoo();
  });

  document.querySelector(".woocommerce-shipping-calculator")?.addEventListener("submit", e => {
    e.preventDefault();
    renderCartWoo();
  });

  document.querySelector(".shipping-calculator-button")?.addEventListener("click", e => {
    e.preventDefault();
    let form = document.querySelector(".shipping-calculator-form");
    form.style.display = form.style.display === "none" ? "block" : "none";
  });

  document.querySelector(".ux-cart-coupon")?.addEventListener("submit", e => {
    e.preventDefault();
    let couponCode = document.querySelector("#coupon_code").value;
    alert(`Áp dụng mã ưu đãi: ${couponCode}`);
  });
}

function renderCheckout() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let woocommerceContainer = document.querySelector(".woocommerce");
  let shippingFee = 30000;

  if (!woocommerceContainer) return;

  if (cart.length === 0) {
    woocommerceContainer.innerHTML = `
      <div class="text-center pt pb">
        <div class="woocommerce-notices-wrapper"></div>
        <div class="wc-empty-cart-message"></div>
        <p class="return-to-shop">
          <a class="button primary wc-backward" href="/">
            Quay trở lại cửa hàng
          </a>
        </p>
      </div>
    `;
    return;
  }

  const countries = [
    { value: "", text: "Chọn Quốc gia/Khu vực…" },
    { value: "AF", text: "Afghanistan" },
    { value: "EG", text: "Ai Cập" },
    { value: "AX", text: "Åland Islands" },
    { value: "AL", text: "Albania" },
    { value: "DZ", text: "Algeria" },
    { value: "AS", text: "American Samoa" },
    { value: "AD", text: "Andorra" },
    { value: "AO", text: "Angola" },
    { value: "AI", text: "Anguilla" },
    { value: "GB", text: "Anh (UK)" },
    { value: "AQ", text: "Antarctica" },
    { value: "AG", text: "Antigua và Barbuda" },
    { value: "AT", text: "Áo" },
    { value: "AR", text: "Argentina" },
    { value: "AM", text: "Armenia" },
    { value: "AW", text: "Aruba" },
    { value: "AZ", text: "Azerbaijan" },
    { value: "IN", text: "Ấn Độ" },
    { value: "BS", text: "Bahamas" },
    { value: "BH", text: "Bahrain" },
    { value: "BD", text: "Bangladesh" },
    { value: "BB", text: "Barbados" },
    { value: "BY", text: "Belarus" },
    { value: "PW", text: "Belau" },
    { value: "BZ", text: "Belize" },
    { value: "BJ", text: "Benin" },
    { value: "BM", text: "Bermuda" },
    { value: "BT", text: "Bhutan" },
    { value: "BE", text: "Bỉ" },
    { value: "BO", text: "Bolivia" },
    { value: "BQ", text: "Bonaire, Saint Eustatius và Saba" },
    { value: "BA", text: "Bosnia và Herzegovina" },
    { value: "BW", text: "Botswana" },
    { value: "PT", text: "Bồ Đào Nha" },
    { value: "CI", text: "Bờ biển Ngà" },
    { value: "BR", text: "Brazil" },
    { value: "BN", text: "Brunei" },
    { value: "BG", text: "Bulgaria" },
    { value: "BF", text: "Burkina Faso" },
    { value: "BI", text: "Burundi" },
    { value: "UM", text: "Các Tiểu đảo xa của Hoa Kỳ (US)" },
    { value: "AE", text: "Các tiểu vương quốc Ả Rập" },
    { value: "CM", text: "Cameroon" },
    { value: "KH", text: "Campuchia" },
    { value: "CA", text: "Canada" },
    { value: "CV", text: "Cape Verde" },
    { value: "TD", text: "Chad" },
    { value: "CL", text: "Chile" },
    { value: "CX", text: "Christmas Island" },
    { value: "CO", text: "Colombia" },
    { value: "KM", text: "Comoros" },
    { value: "CG", text: "Congo (Brazzaville)" },
    { value: "CD", text: "Congo (Kinshasa)" },
    { value: "CR", text: "Costa Rica" },
    { value: "DO", text: "Cộng hòa Dominica" },
    { value: "CZ", text: "Cộng hòa Séc" },
    { value: "CF", text: "Cộng hòa Trung Phi" },
    { value: "HR", text: "Croatia" },
    { value: "CU", text: "Cuba" },
    { value: "CW", text: "CuraÇao" },
    { value: "CY", text: "Cyprus" },
    { value: "DJ", text: "Djibouti" },
    { value: "DM", text: "Dominica" },
    { value: "TW", text: "Đài Loan" },
    { value: "DK", text: "Đan Mạch" },
    { value: "BV", text: "Đảo Bouvet" },
    { value: "HM", text: "Đảo Heard và quần đảo McDonald" },
    { value: "IM", text: "Đảo Man" },
    { value: "WS", text: "Đảo Samoa" },
    { value: "TL", text: "Đông Timo" },
    { value: "DE", text: "Đức" },
    { value: "EC", text: "Ecuador" },
    { value: "SV", text: "El Salvador" },
    { value: "ER", text: "Eritrea" },
    { value: "EE", text: "Estonia" },
    { value: "SZ", text: "Eswatini" },
    { value: "ET", text: "Ethiopia" },
    { value: "FJ", text: "Fiji" },
    { value: "GA", text: "Gabon" },
    { value: "GM", text: "Gambia" },
    { value: "GE", text: "Georgia" },
    { value: "GH", text: "Ghana" },
    { value: "GI", text: "Gibraltar" },
    { value: "GL", text: "Greenland" },
    { value: "GD", text: "Grenada" },
    { value: "GP", text: "Guadeloupe" },
    { value: "GU", text: "Guam" },
    { value: "GT", text: "Guatemala" },
    { value: "GG", text: "Guernsey" },
    { value: "GN", text: "Guinea" },
    { value: "GQ", text: "Guinea Xích đạo" },
    { value: "GW", text: "Guinea-Bissau" },
    { value: "GY", text: "Guyana" },
    { value: "GF", text: "Guyane thuộc Pháp" },
    { value: "NL", text: "Hà Lan" },
    { value: "HT", text: "Haiti" },
    { value: "KR", text: "Hàn Quốc" },
    { value: "HN", text: "Honduras" },
    { value: "HK", text: "Hồng Kông" },
    { value: "HU", text: "Hungary" },
    { value: "GR", text: "Hy Lạp" },
    { value: "IS", text: "Iceland" },
    { value: "ID", text: "Indonesia" },
    { value: "IR", text: "Iran" },
    { value: "IQ", text: "Iraq" },
    { value: "IE", text: "Ireland" },
    { value: "IL", text: "Israel" },
    { value: "JM", text: "Jamaica" },
    { value: "JE", text: "Jersey" },
    { value: "JO", text: "Jordan" },
    { value: "KZ", text: "Kazakhstan" },
    { value: "KE", text: "Kenya" },
    { value: "KI", text: "Kiribati" },
    { value: "KW", text: "Kuwait" },
    { value: "KG", text: "Kyrgyzstan" },
    { value: "IO", text: "Lãnh thổ Ấn Độ Dương thuộc Anh" },
    { value: "TF", text: "Lãnh thổ miền Nam nước Pháp" },
    { value: "LA", text: "Lào" },
    { value: "LV", text: "Latvia" },
    { value: "LB", text: "Lebanon" },
    { value: "LS", text: "Lesotho" },
    { value: "LR", text: "Liberia" },
    { value: "LY", text: "Libya" },
    { value: "LI", text: "Liechtenstein" },
    { value: "LT", text: "Lithuania" },
    { value: "LU", text: "Luxembourg" },
    { value: "MO", text: "Ma Cao" },
    { value: "MG", text: "Madagascar" },
    { value: "MW", text: "Malawi" },
    { value: "MY", text: "Malaysia" },
    { value: "MV", text: "Maldives" },
    { value: "ML", text: "Mali" },
    { value: "MT", text: "Malta" },
    { value: "MQ", text: "Martinique" },
    { value: "MR", text: "Mauritania" },
    { value: "MU", text: "Mauritius" },
    { value: "YT", text: "Mayotte" },
    { value: "MX", text: "Mexico" },
    { value: "FM", text: "Micronesia" },
    { value: "MD", text: "Moldova" },
    { value: "MC", text: "Monaco" },
    { value: "ME", text: "Montenegro" },
    { value: "MS", text: "Montserrat" },
    { value: "MA", text: "Morocco" },
    { value: "MZ", text: "Mozambique" },
    { value: "MN", text: "Mông Cổ" },
    { value: "US", text: "Mỹ (US)" },
    { value: "MM", text: "Myanmar" },
    { value: "NO", text: "Na Uy" },
    { value: "GS", text: "Nam Georgia và Quần đảo Nam Sandwich" },
    { value: "ZA", text: "Nam Phi" },
    { value: "SS", text: "Nam Sudan" },
    { value: "NA", text: "Namibia" },
    { value: "NR", text: "Nauru" },
    { value: "NP", text: "Nepal" },
    { value: "NC", text: "New Caledonia" },
    { value: "NZ", text: "New Zealand" },
    { value: "RU", text: "Nga" },
    { value: "JP", text: "Nhật Bản" },
    { value: "NI", text: "Nicaragua" },
    { value: "NE", text: "Niger" },
    { value: "NG", text: "Nigeria" },
    { value: "NU", text: "Niue" },
    { value: "NF", text: "Norfolk Island" },
    { value: "MK", text: "North Macedonia" },
    { value: "OM", text: "Oman" },
    { value: "PK", text: "Pakistan" },
    { value: "PS", text: "Palestinian Territory" },
    { value: "PA", text: "Panama" },
    { value: "PG", text: "Papua New Guinea" },
    { value: "PY", text: "Paraguay" },
    { value: "PE", text: "Peru" },
    { value: "FR", text: "Pháp" },
    { value: "FI", text: "Phần Lan" },
    { value: "PH", text: "Philippines" },
    { value: "PN", text: "Pitcairn" },
    { value: "PF", text: "Polynesia thuộc Pháp" },
    { value: "PR", text: "Puerto Rico" },
    { value: "QA", text: "Qatar" },
    { value: "MP", text: "Quần đảo Bắc Mariana" },
    { value: "KY", text: "Quần đảo Cayman" },
    { value: "CC", text: "Quần đảo Cocos (Keeling)" },
    { value: "CK", text: "Quần đảo Cook" },
    { value: "FK", text: "Quần đảo Falkland" },
    { value: "FO", text: "Quần đảo Faroe" },
    { value: "MH", text: "Quần đảo Marshall" },
    { value: "SB", text: "Quần đảo Solomon" },
    { value: "RE", text: "Reunion" },
    { value: "RO", text: "Romania" },
    { value: "RW", text: "Rwanda" },
    { value: "ST", text: "São Tomé và Príncipe" },
    { value: "BL", text: "Saint Barthélemy" },
    { value: "SH", text: "Saint Helena" },
    { value: "KN", text: "Saint Kitts và Nevis" },
    { value: "LC", text: "Saint Lucia" },
    { value: "SX", text: "Saint Martin (thuộc Hà Lan)" },
    { value: "PM", text: "Saint Pierre và Miquelon" },
    { value: "VC", text: "Saint Vincent và Grenadines" },
    { value: "MF", text: "Saint-Martin (thuộc Pháp)" },
    { value: "SM", text: "San Marino" },
    { value: "SA", text: "Saudi Arabia" },
    { value: "SN", text: "Senegal" },
    { value: "RS", text: "Serbia" },
    { value: "SC", text: "Seychelles" },
    { value: "SL", text: "Sierra Leone" },
    { value: "SG", text: "Singapore" },
    { value: "SK", text: "Slovakia" },
    { value: "SI", text: "Slovenia" },
    { value: "SO", text: "Somalia" },
    { value: "LK", text: "Sri Lanka" },
    { value: "SD", text: "Sudan" },
    { value: "SR", text: "Suriname" },
    { value: "SJ", text: "Svalbard và Jan Mayen" },
    { value: "SY", text: "Syria" },
    { value: "TJ", text: "Tajikistan" },
    { value: "TZ", text: "Tanzania" },
    { value: "ES", text: "Tây Ban Nha" },
    { value: "TH", text: "Thái Lan" },
    { value: "TR", text: "Thổ Nhĩ Kỳ" },
    { value: "SE", text: "Thụy Điển" },
    { value: "CH", text: "Thụy Sĩ" },
    { value: "TG", text: "Togo" },
    { value: "TK", text: "Tokelau" },
    { value: "TO", text: "Tonga" },
    { value: "KP", text: "Triều Tiên" },
    { value: "TT", text: "Trinidad và Tobago" },
    { value: "CN", text: "Trung Quốc" },
    { value: "TN", text: "Tunisia" },
    { value: "TM", text: "Turkmenistan" },
    { value: "TC", text: "Turks và quần đảo Caicos" },
    { value: "TV", text: "Tuvalu" },
    { value: "AU", text: "Úc" },
    { value: "UG", text: "Uganda" },
    { value: "UA", text: "Ukraine" },
    { value: "UY", text: "Uruguay" },
    { value: "UZ", text: "Uzbekistan" },
    { value: "VU", text: "Vanuatu" },
    { value: "VA", text: "Vatican" },
    { value: "VE", text: "Venezuela" },
    { value: "VN", text: "Việt Nam", selected: true },
    { value: "VG", text: "Virgin Islands (British)" },
    { value: "VI", text: "Virgin Islands (Mỹ)" },
    { value: "WF", text: "Wallis và Futuna" },
    { value: "EH", text: "Western Sahara" },
    { value: "IT", text: "Ý" },
    { value: "YE", text: "Yemen" },
    { value: "ZM", text: "Zambia" },
    { value: "ZW", text: "Zimbabwe" }
  ];

  let countryOptions = countries.map(country => `
    <option value="${country.value}" ${country.selected ? 'selected="selected"' : ''}>${country.text}</option>
  `).join('');

  let subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  let total = subtotal + shippingFee;

  let orderItemsHtml = cart.map(item => `
    <tr class="cart_item">
      <td class="product-name">
        ${item.name}&nbsp; <strong class="product-quantity">×&nbsp;${item.quantity}</strong>
      </td>
      <td class="product-total">
        <span class="woocommerce-Price-amount amount"><bdi>${(item.price * item.quantity).toLocaleString()}&nbsp;<span class="woocommerce-Price-currencySymbol">₫</span></bdi></span>
      </td>
    </tr>
  `).join('');

  woocommerceContainer.innerHTML = `
    <div class="woocommerce-notices-wrapper"></div>
    <div class="woocommerce-form-coupon-toggle">
      <div class="woocommerce-info message-wrapper">
        <div class="message-container container medium-text-center">
          Bạn có mã ưu đãi? <a href="#" class="showcoupon">Ấn vào đây để nhập mã</a>
        </div>
      </div>
    </div>
    <form class="checkout_coupon woocommerce-form-coupon has-border is-dashed" method="post" style="display:none">
      <p>Nếu bạn có mã giảm giá, vui lòng điền vào phía bên dưới.</p>
      <div class="coupon">
        <div class="flex-row medium-flex-wrap">
          <div class="flex-col flex-grow">
            <label for="coupon_code" class="screen-reader-text">Ưu đãi:</label>
            <input type="text" name="coupon_code" class="input-text" placeholder="Mã ưu đãi" id="coupon_code" value="">
          </div>
          <div class="flex-col">
            <button type="submit" class="button expand" name="apply_coupon" value="Áp dụng">Áp dụng</button>
          </div>
        </div>
      </div>
    </form>
    <div class="woocommerce-notices-wrapper"></div>
    <form name="checkout" method="post" class="checkout woocommerce-checkout" action="/thanh-toan/" enctype="multipart/form-data" aria-label="Thanh toán" novalidate="novalidate">
      <div class="row pt-0">
        <div class="large-7 col">
          <div id="customer_details">
            <div class="clear">
              <wc-order-attribution-inputs>
                <input type="hidden" name="wc_order_attribution_source_type" value="referral">
                <input type="hidden" name="wc_order_attribution_referrer" value="http://127.0.0.1:5500/">
                <input type="hidden" name="wc_order_attribution_utm_campaign" value="(none)">
                <input type="hidden" name="wc_order_attribution_utm_source" value="127.0.0.1">
                <input type="hidden" name="wc_order_attribution_utm_medium" value="referral">
                <input type="hidden" name="wc_order_attribution_utm_content" value="/">
                <input type="hidden" name="wc_order_attribution_utm_id" value="(none)">
                <input type="hidden" name="wc_order_attribution_utm_term" value="(none)">
                <input type="hidden" name="wc_order_attribution_utm_source_platform" value="(none)">
                <input type="hidden" name="wc_order_attribution_utm_creative_format" value="(none)">
                <input type="hidden" name="wc_order_attribution_utm_marketing_tactic" value="(none)">
                <input type="hidden" name="wc_order_attribution_session_entry" value="https://tramanvat.vn/san-pham/bim-bim-que-tam-ba-tuyet-300gr/">
                <input type="hidden" name="wc_order_attribution_session_start_time" value="2025-09-03 02:42:12">
                <input type="hidden" name="wc_order_attribution_session_pages" value="9">
                <input type="hidden" name="wc_order_attribution_session_count" value="4">
                <input type="hidden" name="wc_order_attribution_user_agent" value="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36">
              </wc-order-attribution-inputs>
              <div class="woocommerce-billing-fields">
                <h3>Thông tin thanh toán</h3>
                <div class="woocommerce-billing-fields__field-wrapper">
                  <p class="form-row form-row-wide validate-required" id="billing_last_name_field" data-priority="">
                    <label for="billing_last_name" class="">Họ và tên&nbsp;<abbr class="required" title="bắt buộc">*</abbr></label>
                    <span class="woocommerce-input-wrapper">
                      <input type="text" class="input-text" name="billing_last_name" id="billing_last_name" placeholder="Nhập đầy đủ họ và tên của bạn" value="" aria-required="true">
                    </span>
                  </p>
                  <p class="form-row form-row-wide address-field update_totals_on_change validate-required" id="billing_country_field" data-priority="40">
                    <label for="billing_country" class="">Quốc gia/Khu vực&nbsp;<abbr class="required" title="bắt buộc">*</abbr></label>
                    <span class="woocommerce-input-wrapper">
                      <select name="billing_country" id="billing_country" class="country_to_state country_select" aria-required="true" autocomplete="country" data-placeholder="Chọn Quốc gia/Khu vực…" data-label="Quốc gia/Khu vực">
                        ${countryOptions}
                      </select>
                    </span>
                  </p>
                  <p class="form-row address-field validate-required form-row-first" id="billing_address_1_field" data-priority="50">
                    <label for="billing_address_1" class="">Địa chỉ&nbsp;<abbr class="required" title="bắt buộc">*</abbr></label>
                    <span class="woocommerce-input-wrapper">
                      <input type="text" class="input-text" name="billing_address_1" id="billing_address_1" placeholder="Địa chỉ" value="" aria-required="true" autocomplete="address-line1" data-placeholder="Địa chỉ">
                    </span>
                  </p>
                  <p class="form-row form-row-wide validate-required validate-phone" id="billing_phone_field" data-priority="100">
                    <label for="billing_phone" class="">Số điện thoại&nbsp;<abbr class="required" title="bắt buộc">*</abbr></label>
                    <span class="woocommerce-input-wrapper">
                      <input type="tel" class="input-text" name="billing_phone" id="billing_phone" placeholder="" value="" aria-required="true" autocomplete="tel">
                    </span>
                  </p>
                  <p class="form-row form-row-wide validate-required validate-email" id="billing_email_field" data-priority="110">
                    <label for="billing_email" class="">Địa chỉ email&nbsp;<abbr class="required" title="bắt buộc">*</abbr></label>
                    <span class="woocommerce-input-wrapper">
                      <input type="email" class="input-text" name="billing_email" id="billing_email" placeholder="" value="" aria-required="true" autocomplete="email">
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div class="clear">
              <div class="woocommerce-shipping-fields">
                <h3 id="ship-to-different-address">
                  <label class="woocommerce-form__label woocommerce-form__label-for-checkbox checkbox">
                    <input id="ship-to-different-address-checkbox" class="woocommerce-form__input woocommerce-form__input-checkbox input-checkbox" type="checkbox" name="ship_to_different_address" value="1">
                    <span>Giao hàng tới địa chỉ khác?</span>
                  </label>
                </h3>
                <div class="shipping_address" style="display: none;">
                  <div class="woocommerce-shipping-fields__field-wrapper">
                    <p class="form-row form-row-wide validate-required" id="shipping_last_name_field" data-priority="">
                      <label for="shipping_last_name" class="">Họ và tên&nbsp;<abbr class="required" title="bắt buộc">*</abbr></label>
                      <span class="woocommerce-input-wrapper">
                        <input type="text" class="input-text" name="shipping_last_name" id="shipping_last_name" placeholder="Nhập đầy đủ họ và tên của người nhận" value="" aria-required="true">
                      </span>
                    </p>
                    <p class="form-row form-row-wide validate-required" id="shipping_phone_field" data-priority="">
                      <label for="shipping_phone" class="">Điện thoại&nbsp;<abbr class="required" title="bắt buộc">*</abbr></label>
                      <span class="woocommerce-input-wrapper">
                        <input type="text" class="input-text" name="shipping_phone" id="shipping_phone" placeholder="Số điện thoại người nhận hàng" value="" aria-required="true">
                      </span>
                    </p>
                    <p class="form-row address-field form-row-first validate-required" id="shipping_address_1_field" data-priority="50">
                      <label for="shipping_address_1" class="">Địa chỉ&nbsp;<abbr class="required" title="bắt buộc">*</abbr></label>
                      <span class="woocommerce-input-wrapper">
                        <input type="text" class="input-text" name="shipping_address_1" id="shipping_address_1" placeholder="Địa chỉ mà bạn sẽ nhận hàng" value="" aria-required="true" autocomplete="address-line1">
                      </span>
                    </p>
                    <p class="form-row" id="shipping_first_name_field" data-priority="">
                      <span class="woocommerce-input-wrapper">
                        <input type="text" class="input-text" name="shipping_first_name" id="shipping_first_name" placeholder="" value="">
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div class="woocommerce-additional-fields">
                <div class="woocommerce-additional-fields__field-wrapper"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="large-5 col">
          <div class="col-inner has-border">
            <div class="checkout-sidebar sm-touch-scroll">
              <h3 id="order_review_heading">Đơn hàng của bạn</h3>
              <div id="order_review" class="woocommerce-checkout-review-order">
                <table class="shop_table woocommerce-checkout-review-order-table">
                  <thead>
                    <tr>
                      <th class="product-name">Sản phẩm</th>
                      <th class="product-total">Tạm tính</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${orderItemsHtml}
                  </tbody>
                  <tfoot>
                    <tr class="cart-subtotal">
                      <th>Tạm tính</th>
                      <td><span class="woocommerce-Price-amount amount"><bdi>${subtotal.toLocaleString()}&nbsp;<span class="woocommerce-Price-currencySymbol">₫</span></bdi></span></td>
                    </tr>
                    <tr class="woocommerce-shipping-totals shipping">
                      <td class="shipping__inner" colspan="2">
                        <table class="shipping__table">
                          <tbody>
                            <tr>
                              <th>Giao hàng</th>
                              <td data-title="Giao hàng">
                                <ul id="shipping_method" class="shipping__list woocommerce-shipping-methods">
                                  <li class="shipping__list_item">
                                    <input type="hidden" name="shipping_method[0]" data-index="0" id="shipping_method_0_flat_rate2" value="flat_rate:2" class="shipping_method">
                                    <label class="shipping__list_label" for="shipping_method_0_flat_rate2">Đồng giá: <span class="woocommerce-Price-amount amount"><bdi>${shippingFee.toLocaleString()}&nbsp;<span class="woocommerce-Price-currencySymbol">₫</span></bdi></span></label>
                                  </li>
                                </ul>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                    <tr class="order-total">
                      <th>Tổng</th>
                      <td><strong><span class="woocommerce-Price-amount amount"><bdi>${total.toLocaleString()}&nbsp;<span class="woocommerce-Price-currencySymbol">₫</span></bdi></span></strong></td>
                    </tr>
                  </tfoot>
                </table>
                <div id="payment" class="woocommerce-checkout-payment">
                  <ul class="wc_payment_methods payment_methods methods">
                    <li class="wc_payment_method payment_method_bacs">
                      <input id="payment_method_bacs" type="radio" class="input-radio" name="payment_method" value="bacs" checked="checked" data-order_button_text="">
                      <label for="payment_method_bacs">Chuyển khoản ngân hàng</label>
                      <div class="payment_box payment_method_bacs">
                        <p>Thực hiện thanh toán vào ngay tài khoản ngân hàng của chúng tôi. Vui lòng sử dụng Mã đơn hàng của bạn trong phần Nội dung thanh toán. Đơn hàng sẽ được giao sau khi tiền đã chuyển.</p>
                      </div>
                    </li>
                    <li class="wc_payment_method payment_method_cheque">
                      <input id="payment_method_cheque" type="radio" class="input-radio" name="payment_method" value="cheque" data-order_button_text="">
                      <label for="payment_method_cheque">Kiểm tra thanh toán</label>
                      <div class="payment_box payment_method_cheque" style="display:none;">
                        <p>Vui lòng gửi chi phiếu của bạn đến Tên cửa hàng, Đường của cửa hàng, Thị trấn của cửa hàng, Bang / Hạt của cửa hàng, Mã bưu điện cửa hàng.</p>
                      </div>
                    </li>
                    <li class="wc_payment_method payment_method_cheque">
                      <input id="payment_method_momo" type="radio" class="input-radio" name="payment_method" value="momo" data-order_button_text="">
                      <label for="payment_method_momo">Momo</label>
                      <div class="payment_box payment_method_momo" style="display:none;">
                   <div style="display:flex; align-items:center; gap:12px;">
                      <img src="https://static.momocdn.net/app/img/payment/logo.png" style="width: 40px;height: 40px;border-radius: 10px;display: inline;">
                        <p style="margin: 0px;" >Thanh toán bằng ví điện tử Momo</p>
                   </div>
                      </div>
                    </li>
                  </ul>
                  <div class="form-row place-order">
                    <noscript>
                      Trình duyệt của bạn không hỗ trợ JavaScript, hoặc nó bị vô hiệu hóa, hãy đảm bảo bạn nhấp vào <em>Cập nhật giỏ hàng</em> trước khi bạn thanh toán. Bạn có thể phải trả nhiều hơn số tiền đã nói ở trên, nếu bạn không làm như vậy. <br/>
                      <button type="submit" class="button alt" name="woocommerce_checkout_update_totals" value="Cập nhật tổng">Cập nhật tổng</button>
                    </noscript>
                    <div class="woocommerce-terms-and-conditions-wrapper mb-half"></div>
                    <button type="submit" class="button alt" name="woocommerce_checkout_place_order" id="place_order" value="Đặt hàng" data-value="Đặt hàng">Đặt hàng</button>
                    <input type="hidden" id="woocommerce-process-checkout-nonce" name="woocommerce-process-checkout-nonce" value="e29a61ddbd">
                    <input type="hidden" name="_wp_http_referer" value="/?wc-ajax=update_order_review">
                  </div>
                </div>
              </div>
              <div class="woocommerce-privacy-policy-text">
                <p>Thông tin cá nhân của bạn sẽ được sử dụng để xử lý đơn hàng, tăng trải nghiệm sử dụng website, và cho các mục đích cụ thể khác đã được Mô tả sản phẩm trong <a href="" class="woocommerce-privacy-policy-link" target="_blank">Chính sách bảo mật</a>.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  `;

  document.querySelector(".showcoupon")?.addEventListener("click", e => {
    e.preventDefault();
    let couponForm = document.querySelector(".checkout_coupon");
    couponForm.style.display = couponForm.style.display === "none" ? "block" : "none";
  });

  document.querySelector(".checkout_coupon")?.addEventListener("submit", e => {
    e.preventDefault();
    let couponCode = document.querySelector("#coupon_code").value;
    alert(`Áp dụng mã ưu đãi: ${couponCode}`);
  });

  document.querySelector("#ship-to-different-address-checkbox")?.addEventListener("change", e => {
    let shippingAddress = document.querySelector(".shipping_address");
    shippingAddress.style.display = e.target.checked ? "block" : "none";
  });

  document.querySelectorAll(".wc_payment_method input[type='radio']").forEach(radio => {
    radio.addEventListener("change", e => {
      document.querySelectorAll(".payment_box").forEach(box => {
        box.style.display = "none";
      });
      let selectedBox = document.querySelector(`.payment_box.payment_method_${e.target.value}`);
      if (selectedBox) selectedBox.style.display = "block";
    });
  });

  document.querySelector(".woocommerce-checkout")?.addEventListener("submit", e => {
    e.preventDefault();
    let billingLastName = document.querySelector("#billing_last_name").value;
    let billingCountry = document.querySelector("#billing_country").value;
    let billingAddress = document.querySelector("#billing_address_1").value;
    let billingPhone = document.querySelector("#billing_phone").value;
    let billingEmail = document.querySelector("#billing_email").value;

    if (!billingLastName || !billingCountry || !billingAddress || !billingPhone || !billingEmail) {
      alert("Vui lòng điền đầy đủ các trường bắt buộc!");
      return;
    }

    alert("Đặt hàng thành công!");
    checkout();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadCart();
  if (window.location.pathname.includes("/thanh-toan/")) {
    renderCheckout();
  } else {
    renderCartWoo();
  }
});