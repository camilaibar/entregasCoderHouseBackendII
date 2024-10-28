import { Router } from "express";
import CartManager from "../../managers/CartManager.js";

const router = Router();
const cartManager = new CartManager();

router.get("/", (req, res) => {
  try {
    const data = cartManager.readAllCarts();
    if (data) return res.status(200).json(data);
    return res.status(400).send("No carts on storage");
  } catch (error) {
    return res
      .status(500)
      .send("Error reading carts, try again later. " + error);
  }
});

router.get("/:cid", (req, res) => {
  const { cid } = req.params;
  if (!cid || !Number(cid)) return res.status(400).send("Invalid cid");

  try {
    const data = cartManager.readCartByID(Number(cid));
    if (data) return res.status(200).json(data);
    return res.status(400).send("Invalid cid");
  } catch (error) {
    return res
      .status(500)
      .send("Error reading cart, try again later. " + error);
  }
});

router.post("/", (req, res) => {
  let { products } = req.body;

  if (!products || !Array.isArray(products))
    return res.status(400).send("Invalid body params");

  try {
    cartManager.createCart(products);
    return res.status(200).json(cartManager.readAllCarts());
  } catch (error) {
    return res
      .status(500)
      .send("Error creating cart, try again later. " + error);
  }
});

router.put("/:cid", (req, res) => {
  const { cid } = req.params;
  const { products } = req.body;

  if (!cid || !Number(cid)) return res.status(400).send("Invalid cid");

  if (!products || !Array.isArray(products))
    return res.status(400).send("Invalid body params");

  try {
    cartManager.updateCartByID({
      cid: cid,
      products: products,
    });
    const result = cartManager.readAllCarts();
    return res.status(200).json(result);
  } catch (error) {
    return res
      .status(500)
      .send("Error updating cart, try again later. ", error);
  }
});

router.delete("/:cid", (req, res) => {
  const { cid } = req.params;
  if (!cid || !Number(cid)) return res.status(400).send("Invalid cid");

  try {
    cartManager.deleteCartByID(Number(cid));
    return res.status(200).send("Cart deleted succesfully");
  } catch (error) {
    return res
      .status(500)
      .send("Error deleting cart, try again later. ", error);
  }
});

router.post("/:cid/products/:pid", (req, res) => {
  let { cid, pid } = req.params;

  if (!cid || !Number(cid)) return res.status(400).send("Invalid cid");
  if (!pid || !Number(pid)) return res.status(400).send("Invalid pid");

  try {
    cartManager.addProductToCart(pid, cid);
    return res.status(200).json(cartManager.readAllCarts());
  } catch (error) {
    return res
      .status(500)
      .send("Error creating cart, try again later. " + error);
  }
});

router.delete("/:cid/products/:pid", (req, res) => {
  const { cid, pid } = req.params;
  if (!cid || !Number(cid)) return res.status(400).send("Invalid cid");
  if (!pid || !Number(pid)) return res.status(400).send("Invalid pid");

  try {
    cartManager.deleteProductByIDFromCart(Number(pid), Number(cid));
    return res.status(200).send("Product deleted from cart succesfully");
  } catch (error) {
    return res
      .status(500)
      .send("Error deleting product from cart, try again later. ", error);
  }
});

export default router;
