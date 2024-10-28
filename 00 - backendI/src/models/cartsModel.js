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
          default: 0,
          required: true,
        },
      },
    ],
    default: [],
  },
});

// Mongoose middlewares
cartsSchema.plugin(mongoosePaginateV2);

cartsSchema.pre("find", function () {
  this.populate("products.pid");
});

const cartsModel = mongoose.model(cartsCollection, cartsSchema);

export default cartsModel;
