import { cart } from "../data/cart.js";
import { products } from "../data/products.js";
import { addToCart } from "../data/cart.js";
import { formatCurrency } from "./utils/currency_converter.js";

let html = "";
products.forEach((product) => {
  html += `
    <div class="product-container">
        <div class="product-image-container">
            <img class="product-image" src="${product.image}">
        </div>

        <div class="product-name limit-text-to-2-lines">
            ${product.name}
        </div>

        <div class="product-rating-container">
            <img class="product-rating-stars" src="images/ratings/rating-${
              product.rating.stars * 10
            }.png">
            <div class="product-rating-count link-primary">
                ${product.rating.count}
            </div>
        </div>

        <div class="product-price">
            $${formatCurrency(product.priceCents)}
        </div>

        <div class="product-quantity-container">
            <select class="js-quantity-selector-${product.id}">
                <option selected value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
            </select>
        </div>

        <div class="product-spacer"></div>

        <div class="added-to-cart js-added-to-cart-${product.id}">
            <img src="images/icons/checkmark.png">
            Added
        </div>

        <button class="add-to-cart-button button-primary js-add-to-cart" 
            data-product-id="${product.id}">
            Add to Cart
        </button>
    </div>
  `;
});

document.querySelector(".products-grid").innerHTML = html;
let addedMessageTimeouts = {};

updateCartQuantity();
document.querySelectorAll(".js-add-to-cart").forEach((product) => {
  product.addEventListener("click", () => {
    let product_id = product.dataset.productId;

    addToCart(product_id);

    updateCartQuantity();

    let addedMessage = document.querySelector(
      `.js-added-to-cart-${product_id}`
    );
    addedMessage.classList.add("added-to-cart-visible");

    if (addedMessageTimeouts[product_id]) {
      clearTimeout(addedMessageTimeouts[product_id]);
    }

    addedMessageTimeouts[product_id] = setTimeout(() => {
      addedMessage.classList.remove("added-to-cart-visible");
    }, 2000);
  });
});

export function updateCartQuantity() {
  let cart_quantity = 0;
  for (let i = 0; i < cart.length; i++) {
    cart_quantity += cart[i].quantity;
  }
  document.querySelector(".cart-quantity").innerText = cart_quantity;
}
