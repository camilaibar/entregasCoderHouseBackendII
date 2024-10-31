import { Router } from "express";
import CartManager from "../../dao/managers/cart.manager.js";

const router = Router();
const cartManager = new CartManager();

router.get("/", async (req, res) => {
  try {
    const data = await cartManager.readAllCarts();
    return data
      ? res.status(200).json(data)
      : res.status(400).send("No carts in storage");
  } catch (error) {
    return res
      .status(500)
      .send("Error reading carts, try again later. " + error.message);
  }
});

router.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  if (!cid) return res.status(400).send("Invalid cid");

  try {
    const data = await cartManager.readCartByID(cid);
    return data
      ? res.status(200).json(data)
      : res.status(400).send("Invalid cid");
  } catch (error) {
    return res
      .status(500)
      .send("Error reading cart, try again later. " + error.message);
  }
});

router.post("/", async (req, res) => {
  const { products } = req.body;
  if (!products || !Array.isArray(products))
    return res.status(400).send("Invalid body parameters");

  try {
    await cartManager.createCart(products);
    const allCarts = await cartManager.readAllCarts();
    return res.status(200).json(allCarts);
  } catch (error) {
    return res
      .status(500)
      .send("Error creating cart, try again later. " + error.message);
  }
});

router.put("/:cid", async (req, res) => {
  const { cid } = req.params;
  const { products } = req.body;
  if (!cid || !products || !Array.isArray(products))
    return res.status(400).send("Invalid parameters");

  try {
    await cartManager.updateCartByID({ cid, products });
    const result = await cartManager.readAllCarts();
    return res.status(200).json(result);
  } catch (error) {
    return res
      .status(500)
      .send("Error updating cart, try again later. " + error.message);
  }
});

router.delete("/:cid", async (req, res) => {
  const { cid } = req.params;
  if (!cid) return res.status(400).send("Invalid cid");

  try {
    const result = await cartManager.deleteAllProductsFromCart(cid);
    return result
      ? res.status(200).send("Cart products removed successfully")
      : res
          .status(500)
          .send(
            "An error occurred while deleting the products from cart, try again later"
          );
  } catch (error) {
    return res
      .status(500)
      .send(
        "Error deleting products from cart, try again later. " + error.message
      );
  }
});

router.post("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  if (!cid || !pid) return res.status(400).send("Invalid cid or pid");

  try {
    const result = await cartManager.addProductToCart(pid, cid);
    return result
      ? res.status(200).json(await cartManager.readAllCarts())
      : res
          .status(500)
          .send(
            "An error occurred while adding the product to the cart, try again later"
          );
  } catch (error) {
    return res
      .status(500)
      .send("Error adding product to cart, try again later. " + error.message);
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  if (!cid || !pid) return res.status(400).send("Invalid cid or pid");

  try {
    await cartManager.deleteProductByIDFromCart(pid, cid);
    return res.status(200).send("Product deleted from cart successfully");
  } catch (error) {
    return res
      .status(500)
      .send(
        "Error deleting product from cart, try again later. " + error.message
      );
  }
});

export default router;
