import { cart } from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import {
  deliveryOptions,
  getDeliveryOption,
} from "../../data/deleveryOptions.js";
import { formatCurrency } from "../utils/currency_converter.js";

export function paymentSummery() {
  let productPriceCent = 0;
  let shippingPriceCents = 0;
  let productQuantity = 0;
  cart.forEach((cartItem) => {
    let product = getProduct(cartItem.id);
    productQuantity += cartItem.quantity;
    productPriceCent += product.priceCents * cartItem.quantity;
    let deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
    shippingPriceCents += deliveryOption.priceCents;
  });

  let totalBeforeTax = productPriceCent + shippingPriceCents;
  let estimateTax = totalBeforeTax * 0.1;
  let totalCents = totalBeforeTax + estimateTax;

  let paymentSummeryHTML = `
        
        <div class="payment-summary-title">
          Order Summary
        </div>

        <div class="payment-summary-row">
          <div>Items (${productQuantity}):</div>
          <div class="payment-summary-money">$${formatCurrency(
            productPriceCent
          )}</div>
        </div>

        <div class="payment-summary-row">
          <div>Shipping &amp; handling:</div>
          <div class="payment-summary-money">$${formatCurrency(
            shippingPriceCents
          )}</div>
        </div>

        <div class="payment-summary-row subtotal-row">
          <div>Total before tax:</div>
          <div class="payment-summary-money">$${formatCurrency(
            totalBeforeTax
          )}</div>
        </div>

        <div class="payment-summary-row">
          <div>Estimated tax (10%):</div>
          <div class="payment-summary-money">$${formatCurrency(
            estimateTax
          )}</div>
        </div>

        <div class="payment-summary-row total-row">
          <div>Order total:</div>
          <div class="payment-summary-money">$${formatCurrency(
            totalCents
          )}</div>
        </div>

        <button class="place-order-button button-primary">
          Place your order
        </button>
      
    `;

  document.querySelector(".payment-summary").innerHTML = paymentSummeryHTML;
}
