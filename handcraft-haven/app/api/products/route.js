import { NextResponse } from "next/server";
import connectDB from "../../config/db";
import Product from "../../models/product";

export async function GET() {
  await connectDB();
  const products = await Product.find().populate("seller");
  return NextResponse.json(products);
}

export async function POST(req) {
  await connectDB();
  const data = await req.json();

  const product = await Product.create(data);
  return NextResponse.json(product);
}
