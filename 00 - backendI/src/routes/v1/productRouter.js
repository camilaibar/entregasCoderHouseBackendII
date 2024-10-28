import { Router } from "express";
import ProductManager from "../../managers/ProductManager.js";

const router = Router();
const productManager = new ProductManager();

router.get("/", async (req, res) => {
  let { limit, page, sort, query } = req.query;

  // Validate limit format
  if (!limit || !Number(limit)) limit = 10;
  if (!page || !Number(page)) page = 1;
  if (!sort) sort = undefined;
  if (!query) query = undefined;

  try {
    const data = await productManager.readAllProducts(limit, page, sort, query);

    if (!data)
      return res.status(500).send({
        status: "error",
        payload: [],
      });
    return res.status(200).json({
      status: "success",
      payload: data.docs || [], //Resultado de los productos solicitados
      totalPages: data.totalDocs, //Total de páginas
      prevPage: data.prevPage, //Página anterior
      nextPage: data.nextPage, //Página siguiente
      page: data.page, //Página actual
      hasPrevPage: data.hasPrevPage, //Indicador para saber si la página previa existe
      hasNextPage: data.hasNextPage, //Indicador para saber si la página siguiente existe.
      prevLink: `?page=${data.prevPage}`, //Link directo a la página previa (null si hasPrevPage=false)
      nextLink: `?page=${data.nextPage}`, //Link directo a la página siguiente (null si hasNextPage=false)
    });
  } catch (error) {
    return res
      .status(500)
      .send("Error reading products, try again later. " + error);
  }
});

router.get("/:pid", async (req, res) => {
  const { pid } = req.params;
  if (!pid) return res.status(400).send("Invalid pid");

  try {
    const data = await productManager.readProductByID(pid);
    if (data) return res.status(200).json(data);
    return res.status(400).send("Invalid pid");
  } catch (error) {
    return res
      .status(500)
      .send("Error reading product, try again later. " + error);
  }
});

router.post("/", async (req, res) => {
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
    await productManager.createProduct({
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    });

    return res.redirect("/handlebars/realTimeProducts");
  } catch (error) {
    return res
      .status(500)
      .send("Error creating product, try again later. " + error);
  }
});

router.put("/:pid", async (req, res) => {
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

  if (!pid) return res.status(400).send("Invalid pid");

  try {
    const data = await productManager.readProductByID(pid);
    if (data) {
      const newProduct = {
        pid: data._id,
        title: title ? title : data.title,
        description: description ? description : data.description,
        code: code ? code : data.code,
        price: price ? price : data.price,
        status: status ? status : data.status,
        stock: stock ? stock : data.stock,
        category: category ? category : data.category,
        thumbnails: Array.isArray(thumbnails) ? thumbnails : data.thumbnails,
      };

      const updateResult = await productManager.updateProductByID(newProduct);
      if (updateResult === undefined)
        return res
          .status(500)
          .send("An error occured while updating the product, try again later");

      const result = await productManager.readAllProducts();
      return res.status(200).json(result);
    }
    return res.status(400).send("Invalid pid");
  } catch (error) {
    return res
      .status(500)
      .send("Error updating product, try again later. ", error);
  }
});

router.delete("/:pid", async (req, res) => {
  const { pid } = req.params;
  if (!pid) return res.status(400).send("Invalid pid");

  try {
    await productManager.deleteProductByID(pid);
    return res.status(200).send("Product deleted succesfully");
  } catch (error) {
    return res
      .status(500)
      .send("Error deleting product, try again later. ", error);
  }
});

export default router;
