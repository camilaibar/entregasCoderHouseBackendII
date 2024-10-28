import productModel from "../models/productsModel.js";

class ProductManager {
  createProduct = async (product) => {
    try {
      const result = await productModel.create(product);
      if (!result) {
        // Product not created
        return undefined;
      }
      return result;
    } catch (error) {
      // Handle any potential errors from MongoDB/Mongoose
      console.error("Error creating product:", error);
      return undefined;
    }
  };

  readAllProducts = async (
    limit = 10,
    page = 1,
    sort = undefined,
    query = undefined
  ) => {
    console.log(page);

    try {
      const filter = query ? { ...query } : {};
      const options = {
        page,
        limit,
        lean: true,
      };

      if (sort) options.sort = { price: sort === "desc" ? -1 : 1, _id: 1 };

      const result = await productModel.paginate(filter, options);
      if (!result) {
        // Products not found
        return undefined;
      }
      return result;
    } catch (error) {
      // Handle any potential errors from MongoDB/Mongoose
      console.error("Error fetching product:", error);
      return undefined;
    }
  };

  readProductByID = async (pid = undefined) => {
    try {
      const result = await productModel.findOne({ _id: pid });
      if (!result) {
        // Product not found
        return undefined;
      }
      return result;
    } catch (error) {
      // Handle any potential errors from MongoDB/Mongoose
      console.error("Error fetching product:", error);
      return undefined;
    }
  };

  productExists = (pid = undefined) => this.readProductByID(pid); // For cart validation only

  updateProductByID = async (product = {}) => {
    const { pid, ...productDetails } = product;

    try {
      const result = await productModel.findOneAndUpdate(
        { _id: pid },
        { $set: productDetails }
      );
      if (!result) {
        // Product not found
        return undefined;
      }
      return result;
    } catch (error) {
      // Handle any potential errors from MongoDB/Mongoose
      console.error("Error fetching product:", error);
      return undefined;
    }
  };

  deleteAllProducts = async () => {
    try {
      const result = await productModel.deleteMany();
      if (!result) {
        // Product not deleted
        return undefined;
      }
      return result;
    } catch (error) {
      // Handle any potential errors from MongoDB/Mongoose
      console.error("Error fetching product:", error);
      return undefined;
    }
  };

  deleteProductByID = async (pid = undefined) => {
    try {
      const result = await productModel.deleteOne({ _id: pid });
      if (!result) {
        // Product not deleted
        return undefined;
      }
      return result;
    } catch (error) {
      // Handle any potential errors from MongoDB/Mongoose
      console.error("Error fetching product:", error);
      return undefined;
    }
  };
}
export default ProductManager;
