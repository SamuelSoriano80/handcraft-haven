import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name: { type: String, default: "Anonymous" },
  description: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  createdAt: { type: Date, default: Date.now }
}, { collection: "reviews" });

export default mongoose.models.Review || mongoose.model("Review", ReviewSchema);
