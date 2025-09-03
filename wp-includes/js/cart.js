
function addToCart(name, price, quantity = 1) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  quantity = parseInt(quantity);

  if (isNaN(quantity) || quantity <= 0) {
    alert("Số lượng không hợp lệ!");
    return;
  }

  let existingItem = cart.find(item => item.name === name);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ name, price, quantity });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
}


function loadCart() {
  let cart = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];
  let cartItemsDiv = document.getElementById("cart-items");
  let total = 0;

  if (!cart.length) {
    localStorage.setItem("cart", JSON.stringify([]));
  }

  if (cartItemsDiv) {
    cartItemsDiv.innerHTML = "";
    cart.forEach((item, index) => {
      total += item.price;
      cartItemsDiv.innerHTML += `
        <p>${item.name} - ${item.price.toLocaleString()}đ
        <button onclick="removeItem(${index})">Xóa</button></p>
      `;
    });
    document.getElementById("total").innerText = "Tổng cộng: " + total.toLocaleString() + "đ";
  }
}

function removeItem(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

function checkout() {
  alert("Thanh toán thành công! (demo)");
  localStorage.removeItem("cart");
  loadCart();
}

window.onload = loadCart;

