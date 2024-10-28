import { Router } from "express";
import CartManager from "../../managers/CartManager.js";

const router = Router();
const cartManager = new CartManager();

router.get("/", async (req, res) => {
  try {
    const data = await cartManager.readAllCarts();
    if (data) return res.status(200).json(data);
    return res.status(400).send("No carts on storage");
  } catch (error) {
    return res
      .status(500)
      .send("Error reading carts, try again later. " + error);
  }
});

router.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  if (!cid) return res.status(400).send("Invalid cid");

  try {
    const data = await cartManager.readCartByID(cid);
    if (data) return res.status(200).json(data);
    return res.status(400).send("Invalid cid");
  } catch (error) {
    return res
      .status(500)
      .send("Error reading cart, try again later. " + error);
  }
});

router.post("/", async (req, res) => {
  let { products } = req.body;

  if (!products || !Array.isArray(products))
    return res.status(400).send("Invalid body params");

  try {
    await cartManager.createCart(products);
    return res.status(200).json(await cartManager.readAllCarts());
  } catch (error) {
    return res
      .status(500)
      .send("Error creating cart, try again later. " + error);
  }
});

router.put("/:cid", async (req, res) => {
  const { cid } = req.params;
  const { products } = req.body;

  if (!cid) return res.status(400).send("Invalid cid");

  if (!products || !Array.isArray(products))
    return res.status(400).send("Invalid body params");

  try {
    await cartManager.updateCartByID({
      cid: cid,
      products: products,
    });
    const result = await cartManager.readAllCarts();
    return res.status(200).json(result);
  } catch (error) {
    return res
      .status(500)
      .send("Error updating cart, try again later. ", error);
  }
});

router.delete("/:cid", async (req, res) => {
  const { cid } = req.params;
  if (!cid) return res.status(400).send("Invalid cid");

  try {
    const result = await cartManager.deleteAllProductsFromCart(cid);
    if (result === undefined)
      return res
        .status(500)
        .send(
          "An error occured while deleting the products from cart, try again later"
        );
    return res.status(200).send("Cart products removed succesfully");
  } catch (error) {
    return res
      .status(500)
      .send("Error deleting products from cart, try again later. ", error);
  }
});

router.post("/:cid/products/:pid", async (req, res) => {
  let { cid, pid } = req.params;

  if (!cid) return res.status(400).send("Invalid cid");
  if (!pid) return res.status(400).send("Invalid pid");

  try {
    const result = await cartManager.addProductToCart(pid, cid);
    if (result === undefined)
      return res
        .status(500)
        .send(
          "An error occured while adding the product to the cart, try again later"
        );
    return res.status(200).json(await cartManager.readAllCarts());
  } catch (error) {
    return res
      .status(500)
      .send("Error creating cart, try again later. " + error);
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  if (!cid) return res.status(400).send("Invalid cid");
  if (!pid) return res.status(400).send("Invalid pid");

  try {
    await cartManager.deleteProductByIDFromCart(pid, cid);
    return res.status(200).send("Product deleted from cart succesfully");
  } catch (error) {
    return res
      .status(500)
      .send("Error deleting product from cart, try again later. ", error);
  }
});

export default router;
