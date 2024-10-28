import { Router } from "express";
import ProductManager from "../../managers/ProductManager.js";

const router = Router();
const productManager = new ProductManager();

router.get("/", (req, res) => {
  try {
    const data = productManager.readAllProducts();
    if (data) return res.status(200).json(data);
    return res.status(400).send("No products on storage");
  } catch (error) {
    return res
      .status(500)
      .send("Error reading products, try again later. " + error);
  }
});

router.get("/:pid", (req, res) => {
  const { pid } = req.params;
  if (!pid || !Number(pid)) return res.status(400).send("Invalid pid");

  try {
    const data = productManager.readProductByID(Number(pid));
    if (data) return res.status(200).json(data);
    return res.status(400).send("Invalid pid");
  } catch (error) {
    return res
      .status(500)
      .send("Error reading product, try again later. " + error);
  }
});

router.post("/", (req, res) => {
  let { title, description, code, price, status, stock, category, thumbnails } =
    req.body;

  if (
    !title ||
    !description ||
    !code ||
    !price ||
    !+price ||
    !stock ||
    Number(stock) < 0 || // Stock can be 0 or more
    !category
  )
    return res.status(400).send("Invalid body params");

  if (!thumbnails || !Array.isArray(thumbnails)) thumbnails = [];
  if (!status) status = true;

  try {
    productManager.createProduct(
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails
    );
    //return res.status(200).json(productManager.readAllProducts());
    return res.redirect("/handlebars/realTimeProducts");
  } catch (error) {
    return res
      .status(500)
      .send("Error creating product, try again later. " + error);
  }
});

router.put("/:pid", (req, res) => {
  const { pid } = req.params;
  const {
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  } = req.body;

  if (!pid || !Number(pid)) return res.status(400).send("Invalid pid");

  try {
    const data = productManager.readProductByID(pid);
    if (data) {
      const newProduct = {
        pid: data.pid,
        title: title ? title : data.title,
        description: description ? description : data.description,
        code: code ? code : data.code,
        price: price ? price : data.price,
        status: status ? status : data.status,
        stock: stock ? stock : data.stock,
        category: category ? category : data.category,
        thumbnails: Array.isArray(thumbnails) ? thumbnails : data.thumbnails,
      };

      productManager.updateProductByID(newProduct);
      const result = productManager.readAllProducts();
      return res.status(200).json(result);
    }
    return res.status(400).send("Invalid pid");
  } catch (error) {
    return res
      .status(500)
      .send("Error updating product, try again later. ", error);
  }
});

router.delete("/:pid", (req, res) => {
  const { pid } = req.params;
  if (!pid || !Number(pid)) return res.status(400).send("Invalid pid");

  try {
    productManager.deleteProductByID(Number(pid));
    return res.status(200).send("Product deleted succesfully");
  } catch (error) {
    return res
      .status(500)
      .send("Error deleting product, try again later. ", error);
  }
});

export default router;
