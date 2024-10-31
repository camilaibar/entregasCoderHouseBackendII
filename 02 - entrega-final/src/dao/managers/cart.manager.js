import cartModel from "../models/cart.model.js";
import ProductManager from "./product.manager.js";

const productManager = new ProductManager();

class CartManager {
  createCart = async (products = []) => {
    // Filtra productos válidos que existen en el sistema
    const validProducts = await Promise.all(
      products.filter(
        async (product) => await productManager.productExists(product.pid)
      )
    );

    try {
      const result = await cartModel.create({ products: validProducts });
      return result || undefined;
    } catch (error) {
      console.error("Error creating cart:", error);
      return undefined;
    }
  };

  readAllCarts = async () => {
    try {
      const result = await cartModel.find({});
      return result || undefined;
    } catch (error) {
      console.error("Error fetching carts:", error);
      return undefined;
    }
  };

  readCartByID = async (cid) => {
    try {
      const result = await cartModel.findById(cid);
      return result || undefined;
    } catch (error) {
      console.error("Error fetching cart:", error);
      return undefined;
    }
  };

  updateCartByID = async ({ cid, _id, products, status }) => {
    try {
      const result = await cartModel.findByIdAndUpdate(
        cid || _id,
        { $set: { products, status } },
        { new: true } // Return the updated document
      );
      return result || undefined;
    } catch (error) {
      console.error("Error updating cart:", error);
      return undefined;
    }
  };

  deleteAllCarts = async () => {
    try {
      const result = await cartModel.deleteMany();
      return result || undefined;
    } catch (error) {
      console.error("Error deleting carts:", error);
      return undefined;
    }
  };

  deleteCartByID = async (cid) => {
    try {
      const result = await cartModel.findByIdAndDelete(cid);
      return result || undefined;
    } catch (error) {
      console.error("Error deleting cart:", error);
      return undefined;
    }
  };

  addProductToCart = async (pid, cid) => {
    try {
      const productExists = await productManager.productExists(pid);
      if (!productExists) return undefined;

      const cart = await this.readCartByID(cid);
      if (!cart) return undefined;

      const productInCart = cart.products.find(
        (item) => item.pid.toString() === pid
      );
      if (productInCart) {
        productInCart.quantity += 1;
      } else {
        cart.products.push({ pid, quantity: 1 });
      }

      return await this.updateCartByID(cart);
    } catch (error) {
      console.error("Error adding product to cart:", error);
      return undefined;
    }
  };

  deleteAllProductsFromCart = async (cid) => {
    try {
      const cart = await this.readCartByID(cid);
      if (!cart) return undefined;

      cart.products = [];
      return await this.updateCartByID(cart);
    } catch (error) {
      console.error("Error deleting all products from cart:", error);
      return undefined;
    }
  };

  deleteProductByIDFromCart = async (pid, cid) => {
    try {
      const cart = await this.readCartByID(cid);
      if (!cart) return undefined;

      cart.products = cart.products.filter(
        (item) => item.pid.toString() !== pid
      );
      return await this.updateCartByID(cart);
    } catch (error) {
      console.error("Error deleting product from cart:", error);
      return undefined;
    }
  };
}

export default CartManager;
