import mongoose from "mongoose";
import mongoosePaginateV2 from "mongoose-paginate-v2";

const productsCollection = "products";

const productsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Product title is required"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Product description is required"],
    trim: true,
  },
  code: {
    type: String,
    required: [true, "Product code is required"],
    unique: true,
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Product price is required"],
    min: [0, "Price must be a positive value"],
  },
  status: {
    type: Boolean,
    default: true,
  },
  stock: {
    type: Number,
    required: [true, "Product stock is required"],
    min: [0, "Stock cannot be negative"],
  },
  category: {
    type: String,
    required: [true, "Product category is required"],
    trim: true,
  },
  thumbnails: {
    type: [String],
    default: [],
  },
});

// Add pagination plugin
productsSchema.plugin(mongoosePaginateV2);

const productsModel = mongoose.model(productsCollection, productsSchema);

export default productsModel;
