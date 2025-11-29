import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  image: String,
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "Seller" }
});

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);

