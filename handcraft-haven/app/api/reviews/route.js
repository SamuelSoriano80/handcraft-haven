import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Review from "@/app/models/review.js";
import Product from "@/app/models/product.js";

const MONGO_URI = process.env.MONGO_URI;

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGO_URI);
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { productId, name, description, rating } = body || {};

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json({ error: "Invalid or missing productId" }, { status: 400 });
    }

    if (!description || typeof description !== "string") {
      return NextResponse.json({ error: "Description is required" }, { status: 400 });
    }

    const numRating = Number(rating);
    if (!numRating || numRating < 1 || numRating > 5) {
      return NextResponse.json({ error: "Rating must be a number between 1 and 5" }, { status: 400 });
    }

    await connectDB();
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const review = await Review.create({
      product: productId,
      name: name && name.trim() ? name.trim() : "Anonymous",
      description: description.trim(),
      rating: numRating
    });

    return NextResponse.json(review, { status: 201 });
  } catch (err) {
    console.error("POST /api/reviews error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
