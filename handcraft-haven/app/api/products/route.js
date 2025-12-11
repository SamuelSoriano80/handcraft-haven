import { NextResponse } from "next/server";
import connectDB from "../../config/db";
import Product from "../../models/product";

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find();
    return NextResponse.json(products);
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req) {
  await connectDB();
  const data = await req.json();

  const product = await Product.create(data);
  return NextResponse.json(product);
}
