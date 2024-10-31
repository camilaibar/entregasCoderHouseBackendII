import mongoose from "mongoose";
import mongoosePaginateV2 from "mongoose-paginate-v2";

const cartsCollection = "carts";

const cartsSchema = new mongoose.Schema({
  user: { type: String, default: undefined },
  status: { type: Boolean, default: true },
  products: {
    type: [
      {
        pid: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1, // Set to 1 as it's more logical for a product in a cart
          required: true,
        },
      },
    ],
    default: [],
  },
});

// Mongoose plugins
cartsSchema.plugin(mongoosePaginateV2);

// Middleware to auto-populate product details on find queries
const autoPopulateProducts = function (next) {
  this.populate("products.pid");
  next();
};

// Apply the middleware to multiple find methods
cartsSchema
  .pre("find", autoPopulateProducts)
  .pre("findOne", autoPopulateProducts)
  .pre("findById", autoPopulateProducts);

const cartsModel = mongoose.model(cartsCollection, cartsSchema);

export default cartsModel;
