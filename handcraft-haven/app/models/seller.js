import mongoose from "mongoose";

const SellerSchema = new mongoose.Schema({
  name: String,
  biography: String,
  email: { type: String, unique: true },
  password: String,
  avatar: String
});

export default mongoose.models.Seller || mongoose.model("Seller", SellerSchema);
