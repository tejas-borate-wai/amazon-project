import {
  cart,
  removeFromCart,
  updateQuantity,
  updateDeliveryOption,
} from "../../data/cart.js";
import { products, getProduct } from "../../data/products.js";
import { formatCurrency } from "../utils/currency_converter.js";
import { hello } from "https://unpkg.com/supersimpledev@1.0.1/hello.esm.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import {
  deliveryOptions,
  getDeliveryOption,
} from "../../data/deleveryOptions.js";
import { paymentSummery } from "./paymentSummery.js";

export function checkoutOrderSummery() {
  let html = "";
  cart.forEach((cartItem) => {
    let matchingItem;

    products.forEach((productItem) => {
      if (productItem.id === cartItem.id) {
        matchingItem = productItem;
      }
    });

    let deliveryOptionId = cartItem.deliveryOptionId;
    let deliveryOption = getDeliveryOption(deliveryOptionId);

    let today = dayjs();
    let deliveryDate = today.add(deliveryOption.deliveryDays, "days");
    let dateString = deliveryDate.format("dddd  MMMM D");

    html += `
    <div class="cart-item-container js-cart-item-container-${cartItem.id}">
      <div class="delivery-date">
        Delivery date: ${dateString}
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image" src="${matchingItem.image}">

        <div class="cart-item-details">
          <div class="product-name">${matchingItem.name}</div>
          <div class="product-price">$${formatCurrency(
            matchingItem.priceCents
          )}</div>
          <div class="product-quantity">

            <span>Quantity: <span class="quantity-label js-quantity-label-${
              matchingItem.id
            }">${cartItem.quantity}</span></span></span>
            
            <span class="update-quantity-link link-primary js-update-quantity-link" data-update-quantity=${
              cartItem.id
            }>Update</span>

             <input class="quantity-input  js-quantity-input-${cartItem.id}">

            <span class="save-quantity-link link-primary js-save-link"
              data-product-id="${cartItem.id}">
              Save
            </span>

            <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${
              cartItem.id
            }">Delete</span>
          </div>
        </div>

        <div class="delivery-options">
          <div class="delivery-options-title">Choose a delivery option:</div>
          
         ${deliveryOptionsHTML(cartItem)}
        </div>
      </div>
    </div>
  `;
  });

  function deliveryOptionsHTML(cartItem) {
    let html = "";
    deliveryOptions.forEach((deliveryOption) => {
      let today = dayjs();
      let deliveryDate = today.add(deliveryOption.deliveryDays, "days");
      let dateString = deliveryDate.format("dddd  MMMM D");
      let priceString =
        deliveryOption.priceCents === 0
          ? "Free"
          : `$${formatCurrency(deliveryOption.priceCents)} - `;

      let isChecked = deliveryOption.id === cartItem.deliveryOptionId;

      html += `
      <div class="delivery-option js-delivery-option" data-product-id="${
        cartItem.id
      }" data-delivery-option-id="${deliveryOption.id}">
        <input  
          type="radio"
          class="delivery-option-input"
          name="delivery-option-${cartItem.id}"
          
          ${isChecked ? "checked" : ""}
        >
        <div>
          <div class="delivery-option-date">${dateString}</div>
          <div class="delivery-option-price">${priceString} Shipping</div>
        </div>
      </div>
    `;
    });

    return html;
  }

  const orderSummaryElement = document.querySelector(".order-summary");

  if (orderSummaryElement) {
    orderSummaryElement.innerHTML = html;
  } else {
    console.error("Error: .order-summary element not found in HTML");
  }

  // Handle delete item event
  document.querySelectorAll(".js-delete-link").forEach((link) => {
    link.addEventListener("click", () => {
      let productId = link.dataset.productId;
      removeFromCart(productId);

      let productContainer = document.querySelector(
        `.js-cart-item-container-${productId}`
      );
      if (productContainer) {
        productContainer.remove();
      }

      paymentSummery();
    });
  });

  document.querySelectorAll(".js-save-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;

      const container = document.querySelector(
        `.js-cart-item-container-${productId}`
      );
      container.classList.remove("is-editing-quantity");

      const quantityInput = document.querySelector(
        `.js-quantity-input-${productId}`
      );
      const newQuantity = Number(quantityInput.value);
      if (newQuantity < 0 || newQuantity >= 1000) {
        alert("Quantity must be at least 0 and less than 1000");
        return;
      }
      updateQuantity(productId, newQuantity);

      const quantityLabel = document.querySelector(
        `.js-quantity-label-${productId}`
      );
      quantityLabel.innerHTML = newQuantity;

      updateQuantity();
      checkoutQuantity();
      paymentSummery();
    });
  });

  function checkoutQuantity() {
    let qty = 0;
    cart.forEach((cartItem) => {
      qty = qty + cartItem.quantity;
    });
    document.querySelector(
      ".js-return-to-home-link"
    ).innerText = `${qty} Items`;
  }

  checkoutQuantity();

  document.querySelectorAll(".js-update-quantity-link").forEach((link) => {
    link.addEventListener("click", () => {
      let productId = link.dataset.updateQuantity;
      const container = document.querySelector(
        `.js-cart-item-container-${productId}`
      );
      container.classList.add("is-editing-quantity");
      paymentSummery();
    });
  });

  document.querySelectorAll(".js-delivery-option").forEach((element) => {
    element.addEventListener("click", () => {
      const { productId, deliveryOptionId } = element.dataset;
      updateDeliveryOption(productId, deliveryOptionId);

      // Update the delivery date in the UI
      const cartItem = cart.find((item) => item.id === productId);
      const deliveryOption = deliveryOptions.find(
        (option) => option.id === deliveryOptionId
      );

      if (cartItem && deliveryOption) {
        let today = dayjs();
        let deliveryDate = today.add(deliveryOption.deliveryDays, "days");
        let dateString = deliveryDate.format("dddd MMMM D");

        document.querySelector(
          `.js-cart-item-container-${productId} .delivery-date`
        ).innerText = `Delivery date: ${dateString}`;
      }
      paymentSummery();
    });
  });
}
