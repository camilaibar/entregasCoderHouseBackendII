import cartModel from "../models/cartsModel.js";
import ProductManager from "../managers/ProductManager.js";

const productManager = new ProductManager();

class CartManager {
  createCart = async (products = []) => {
    products =
      products.filter(async (product) =>
        (await productManager.productExists(product.pid)) ? product : false
      ) || []; // Only save products that exist

    try {
      const result = await cartModel.create({ products });
      if (!result) {
        // Cart not created
        console.log("1");

        return undefined;
      }
      console.log("2");

      return result;
    } catch (error) {
      // Handle any potential errors from MongoDB/Mongoose
      console.error("Error creating cart:", error);
      return undefined;
    }
  };

  readAllCarts = async () => {
    try {
      const result = await cartModel.find({});
      if (!result) {
        // Carts not found
        return undefined;
      }
      return result;
    } catch (error) {
      // Handle any potential errors from MongoDB/Mongoose
      console.error("Error fetching carts:", error);
      return undefined;
    }
  };

  readCartByID = async (cid = undefined) => {
    try {
      const result = await cartModel.find({ _id: cid });
      if (!result || !result[0]) {
        // Cart not found
        return undefined;
      }
      return result[0];
    } catch (error) {
      // Handle any potential errors from MongoDB/Mongoose
      console.error("Error fetching cart:", error);
      return undefined;
    }
  };

  updateCartByID = async (cart = {}) => {
    // Update Products From Cart
    const { cid, _id, products, status } = cart;
    try {
      const result = await cartModel.findOneAndUpdate(
        { _id: cid || _id },
        { $set: { products, status } }
      );
      if (!result) {
        // Cart not found
        return undefined;
      }
      return result;
    } catch (error) {
      // Handle any potential errors from MongoDB/Mongoose
      console.error("Error fetching cart:", error);
      return undefined;
    }
  };

  deleteAllCarts = async () => {
    try {
      const result = await cartModel.deleteMany();
      if (!result) {
        // Carts not deleted
        return undefined;
      }
      return result;
    } catch (error) {
      // Handle any potential errors from MongoDB/Mongoose
      console.error("Error fetching carts:", error);
      return undefined;
    }
  };

  deleteCartByID = async (cid = undefined) => {
    try {
      const result = await cartModel.deleteOne({ _id: cid });
      if (!result) {
        // Cart not deleted
        return undefined;
      }
      return result;
    } catch (error) {
      // Handle any potential errors from MongoDB/Mongoose
      console.error("Error fetching cart:", error);
      return undefined;
    }
  };

  addProductToCart = async (pid = undefined, cid = undefined) => {
    try {
      let product = await productManager.productExists(pid);
      if (product === undefined) return undefined; // Can not add invalid pid

      let cart = await this.readCartByID(cid);
      if (cart === undefined) return undefined; // Cart does not exist
      // Update product quantity on cart
      let exists = false;
      cart.products = cart.products.map((item) => {
        if (item.pid._id == pid) {
          // Product already on cart
          exists = true;
          item.quantity++;
        }
        return item;
      });

      if (!exists) cart.products.push({ pid: pid, quantity: 1 }); // Product not on cart, add

      return await this.updateCartByID(cart);
    } catch (error) {
      // Handle any potential errors from MongoDB/Mongoose
      console.error("Error updating cart:", error);
      return undefined;
    }
  };

  deleteAllProductsFromCart = async (cid = pid) => {
    let cart = await this.readCartByID(cid);
    if (cart === undefined) return undefined; // Cart does not exist

    cart.products = [];
    return await this.updateCartByID(cart);
  };

  deleteProductByIDFromCart = async (pid = undefined, cid = undefined) => {
    let cart = await this.readCartByID(cid);
    if (cart === undefined) return undefined; // Cart does not exist
    cart.products = cart.products.filter((item) => {
      if (item.pid._id == pid) {
        return false;
      }
      return true;
    });

    return await this.updateCartByID(cart);
  };
}
export default CartManager;
