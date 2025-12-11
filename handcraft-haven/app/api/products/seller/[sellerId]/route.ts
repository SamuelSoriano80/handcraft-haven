import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Product from "@/app/models/product";

const MONGO_URI = process.env.MONGO_URI!;

export async function GET(req: Request, context: any) {
  try {
    const params = await context.params;
    const sellerId = params?.sellerId?.trim();

    if (!sellerId) {
      return NextResponse.json(
        { error: "Missing seller ID" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(sellerId)) {
      return NextResponse.json(
        { error: "Invalid seller ID format" },
        { status: 400 }
      );
    }

    await mongoose.connect(MONGO_URI);

    const products = await Product.find({ seller: sellerId });

    return NextResponse.json(products, { status: 200 });
  } catch (err) {
    console.error("GET /products/seller error:", err);
    return NextResponse.json(
      { error: "Could not load products" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, price, seller } = body;

    if (!title || !price || !seller) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await mongoose.connect(MONGO_URI);

    const product = await Product.create({
      title,
      description,
      price,
      seller
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
