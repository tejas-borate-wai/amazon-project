let cart = JSON.parse(localStorage.getItem("cart"));

if (!cart) {
  cart = [
    {
      id: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
      quantity: 1,
      deliveryOptionId: "1",
    },
    {
      id: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
      quantity: 1,
      deliveryOptionId: "2",
    },
  ];
  saveToStorage();
}

function saveToStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function checkoutQuantity() {
  let qty = 0;
  cart.forEach((cartItem) => {
    qty = qty + cartItem.quantity;
  });
  document.querySelector(".js-return-to-home-link").innerText = `${qty} Items`;
}

export function addToCart(product_id) {
  let quantity_selector = document.querySelector(
    `.js-quantity-selector-${product_id}`
  );
  let quantity = Number(quantity_selector.value);

  let matching_item = cart.find((item) => item.id == product_id);

  if (matching_item) {
    matching_item.quantity += quantity;
  } else {
    cart.push({
      id: product_id,
      quantity,
      deliveryOptionId: "1",
    });
  }

  saveToStorage();
}

export function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  saveToStorage();
  checkoutQuantity();
}

export function updateQuantity(productId, newQuantity) {
  let matchingItem;

  cart.forEach((cartItem) => {
    if (productId === cartItem.id) {
      matchingItem = cartItem;
    }
  });

  if (matchingItem) {
    matchingItem.quantity = newQuantity;
    saveToStorage();
  }
}

export { cart };

export function updateDeliveryOption(productId, deliveryOptionId) {
  let matching_item = cart.find((item) => item.id == productId);
  matching_item.deliveryOptionId = deliveryOptionId;

  saveToStorage();
}
