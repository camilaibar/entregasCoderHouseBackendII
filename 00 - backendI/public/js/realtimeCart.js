const BACKEND_URL = "http://localhost:8080/api";
// Use same cart just for this scenario. in reality i should manage multiple carts for users
const cartID = "66e0b2a5b1a8c1b7a4dbb5ad";

// HTML Tags
const cartTableBody = document.querySelector("#cart-table tbody");
const emptyCartState = document.querySelector("#empty-cart-state");
const emptyCartButton = document.getElementById("empty-cart-btn");
const actionSection = document.querySelector("#section");

// Functions
const loadCart = () => {
  fetch(`${BACKEND_URL}/carts/v1/${cartID}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.products.length === 0) {
        showEmptyState();
        actionSection.style.display = "none";
      } else {
        actionSection.style.display = "flex";
        data.products.forEach((product) => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${product.pid._id}</td>
            <td>${product.pid.title}</td>
            <td>${product.pid.description}</td>
            <td>${product.pid.price}</td>
            <td>${product.quantity}</td>
            <td><button class="remove-from-cart-btn" data-id="${product.pid._id}">Remove</button></td>
          `;
          cartTableBody.appendChild(row);
        });

        const removeFromCartButtons = document.querySelectorAll(
          ".remove-from-cart-btn"
        );
        removeFromCartButtons.forEach((button) => {
          button.addEventListener("click", (e) => {
            const productId = e.target.getAttribute("data-id");
            removeFromCart(productId);
          });
        });
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

const removeFromCart = async (productId) => {
  const url = `${BACKEND_URL}/carts/v1/${cartID}/products/${productId}`;
  try {
    await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    window.location.reload();
  } catch (error) {
    console.error("Error removing product from cart:", error);
  }
};

const emptyCart = () => {
  fetch(`${BACKEND_URL}/carts/v1/${cartID}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .finally(() => window.location.reload())
    .catch((error) => {
      console.error("Error emptying the cart:", error);
    });
};

// Events
loadCart();

// Handlers
emptyCartButton.addEventListener("click", () => {
  emptyCart();
});

const showEmptyState = () => {
  emptyCartState.style.display = "block";
  emptyCartState.style["text-align"] = "center";
};
