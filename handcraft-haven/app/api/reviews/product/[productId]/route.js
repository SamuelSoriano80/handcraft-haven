import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Review from "@/app/models/review.js";

const MONGO_URI = process.env.MONGO_URI;

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGO_URI);
  }
}

export async function GET(req, context) {
  try {
    const params = await context.params;
    const productId = String(params.productId).trim();

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    await connectDB();

    const reviews = await Review.find({ product: productId }).sort({ createdAt: -1 });

    return NextResponse.json(reviews);
  } catch (err) {
    console.error("GET /api/reviews/product/:id error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
