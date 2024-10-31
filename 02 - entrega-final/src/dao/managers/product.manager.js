import productModel from "../models/product.model.js";

class ProductManager {
  createProduct = async (product) => {
    try {
      const result = await productModel.create(product);
      return result || null; // Retorna null si no se pudo crear el producto
    } catch (error) {
      console.error("Error creating product:", error);
      return null;
    }
  };

  readAllProducts = async (limit = 10, page = 1, sort, query) => {
    try {
      const filter = query ? { ...query } : {};
      const options = {
        page,
        limit,
        lean: true,
        sort: sort ? { price: sort === "desc" ? -1 : 1, _id: 1 } : undefined,
      };

      const result = await productModel.paginate(filter, options);
      return result || null; // Retorna null si no se encontraron productos
    } catch (error) {
      console.error("Error fetching products:", error);
      return null;
    }
  };

  readProductByID = async (pid) => {
    try {
      if (!pid) throw new Error("Invalid product ID");
      const result = await productModel.findById(pid).lean();
      return result || null; // Retorna null si no se encontró el producto
    } catch (error) {
      console.error("Error fetching product by ID:", error);
      return null;
    }
  };

  productExists = (pid) => this.readProductByID(pid); // Para la validación de carrito

  updateProductByID = async (product) => {
    const { pid, ...productDetails } = product;
    try {
      if (!pid) throw new Error("Invalid product ID");
      const result = await productModel.findByIdAndUpdate(
        pid,
        { $set: productDetails },
        { new: true, lean: true }
      );
      return result || null; // Retorna null si no se encontró el producto
    } catch (error) {
      console.error("Error updating product by ID:", error);
      return null;
    }
  };

  deleteAllProducts = async () => {
    try {
      const result = await productModel.deleteMany();
      return result || null; // Retorna null si no se pudo eliminar ningún producto
    } catch (error) {
      console.error("Error deleting all products:", error);
      return null;
    }
  };

  deleteProductByID = async (pid) => {
    try {
      if (!pid) throw new Error("Invalid product ID");
      const result = await productModel.findByIdAndDelete(pid);
      return result || null; // Retorna null si no se encontró el producto
    } catch (error) {
      console.error("Error deleting product by ID:", error);
      return null;
    }
  };
}

export default ProductManager;
