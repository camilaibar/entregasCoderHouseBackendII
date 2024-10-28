import fs from "fs";
import path from "path";

const PRODUCTS_PATH = path.resolve() + "/src/storage/products.json";

const getExistingData = () => {
  try {
    if (fs.existsSync(PRODUCTS_PATH)) {
      const data = fs.readFileSync(PRODUCTS_PATH, "utf-8");
      if (data) return JSON.parse(data);
    } else {
      fs.writeFileSync(PRODUCTS_PATH, JSON.stringify([]), (err) =>
        console.log("Error creating carts file", error)
      );
      return [];
    }
  } catch (error) {
    console.error(error);
    return [];
  }
};

const updateProductsData = () => {
  try {
    fs.writeFileSync(
      PRODUCTS_PATH,
      JSON.stringify(ProductManager.productList),
      (err) => console.log("Error creating/updating products file", error)
    );
  } catch (error) {
    console.error(error);
    return [];
  }
};

class ProductManager {
  static productList = getExistingData();
  static productID = this.productList.reduce(
    (prev, accum) => (prev > accum.pid ? prev : accum.pid), // Get the largest id generated
    0
  );

  constructor(
    title = "",
    description = "",
    code = "",
    price = 0,
    status = true,
    stock = 0,
    category = "",
    thumbnails = []
  ) {
    this.pid = ProductManager.productID++;
    this.title = title;
    this.description = description;
    this.code = code;
    this.price = price;
    this.status = status;
    this.stock = stock;
    this.category = category;
    this.thumbnails = thumbnails;
  }
}

ProductManager.prototype.createProduct = (
  title = "",
  description = "",
  code = "",
  price = 0,
  status = true,
  stock = 0,
  category = "",
  thumbnails = []
) => {
  const product = new ProductManager(
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails
  );
  ProductManager.productList.push(product);
  updateProductsData();
};

ProductManager.prototype.readAllProducts = () => ProductManager.productList;

ProductManager.prototype.readProductByID = (pid = undefined) =>
  ProductManager.productList.find((product) => product.pid == pid);

ProductManager.prototype.productExists = (pid = undefined) =>
  ProductManager.productList.find((product) => product.pid == pid) !==
  undefined;

ProductManager.prototype.updateProductByID = (product = {}) => {
  const { pid, ...productDetails } = product;
  const newProduct = {
    ...ProductManager.productList.find((product) => product.pid === pid),
    ...productDetails,
  }; // The second object overrides the values of existing one when defined (pid cannot be overiden)

  ProductManager.productList = ProductManager.productList.map((product) =>
    product.pid === pid ? newProduct : product
  ); // Update product on product list

  updateProductsData(); // Update file
};

ProductManager.prototype.deleteAllProducts = () => {
  ProductManager.productList = [];
  updateProductsData(); // Update file
};

ProductManager.prototype.deleteProductByID = (pid = undefined) => {
  ProductManager.productList = ProductManager.productList.filter(
    (product) => product.pid !== pid
  );

  updateProductsData(); // Update file
};

export default ProductManager;
