console.log("Welcome to my backend with sockets");

const socket = io();
const BACKEND_URL = "http://localhost:8080/api";
const pageNum = new URLSearchParams(window.location.search).get("page") || 0;

// HTML Tags
const formSubmitButtonClick = document.getElementById("loadFormSubmitButton");
const tbody = document.querySelector("#product-table tbody");
const emptyState = document.querySelector("#empty-state");
const tableSection = document.querySelector("#tableSection");

const paginationSection = document.querySelector("#section");
const prevPageButton = document.querySelector("#prevPage");
const pageIndicator = document.querySelector("#page");
const nextPageButton = document.querySelector("#nextPage");

// Handlers
const showEmptyState = () => {
  emptyState.style.display = "block";
  emptyState.style["text-align"] = "center";
};

const addToCart = (productId) => {
  // Use same cart just for this scenario. in reality i should manage multiple carts for users
  const cartID = "66e0b2a5b1a8c1b7a4dbb5ad";
  const url = BACKEND_URL + `/carts/v1/${cartID}/products/${productId}`;

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((error) => {
    console.error("Error adding product to cart:", error);
  });
};

const loadTable = () => {
  // Fetch data from the API
  fetch(BACKEND_URL + "/products/v1?page=" + pageNum)
    .then(async (response) => await response.json())
    .then((data) => {
      if (data.status !== "success" || data.payload.length === 0) {
        showEmptyState();
        paginationSection.style.display = "none";
      } else {
        paginationSection.style.display = "flex";
        pageIndicator.textContent = data.page;
        prevPageButton.disabled = !data.hasPrevPage || data.prevLink === null;
        prevPageButton.onclick = (e) => {
          window.location.href = data.prevLink;
        };
        nextPageButton.disabled = !data.hasNextPage || data.nextLink === null;
        nextPageButton.onclick = (e) => {
          window.location.href = data.nextLink;
        };

        data.payload.forEach((product) => {
          const row = document.createElement("tr");
          row.innerHTML = `
                  <td>${product._id}</td>
                  <td>${product.title}</td>
                  <td>${product.description}</td>
                  <td>${product.code}</td>
                  <td>${product.price}</td>
                  <td>${product.status}</td>
                  <td>${product.stock}</td>
                  <td>${product.category}</td>
                  <td>${product.thumbnail}</td>
                  <td><button class="add-to-cart-btn" data-id="${product._id}">Add</button></td>
                `;
          tbody.appendChild(row);
        });

        // Add event listeners to all "Add" buttons
        const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");
        addToCartButtons.forEach((button) => {
          button.addEventListener("click", (e) =>
            addToCart(e.target.getAttribute("data-id"))
          );
        });
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      showEmptyState();
    });
};

// Events
loadTable();

// New product added
formSubmitButtonClick.onclick = (e) => {
  socket.emit("newProduct", { message: `New product` });
};

// Listeners
socket.on("productListChange", (data) => {
  console.log(data.message);

  // Empty table
  tbody.innerHTML = "";

  // Reload table
  loadTable();
});
