import mongoose from "mongoose";
import mongoosePaginateV2 from "mongoose-paginate-v2";

const productsCollection = "products";

const productsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
    default: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: Array,
    default: [],
  },
});

// Mongoose middlewares
productsSchema.plugin(mongoosePaginateV2);

const productsModel = mongoose.model(productsCollection, productsSchema);

export default productsModel;
