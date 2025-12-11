import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Product from "@/app/models/product.js";

const MONGO_URI = process.env.MONGO_URI!;

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGO_URI);
  }
}

export async function GET(req: Request, context: any) {
  const params = await context.params;
  const id = String(params.id).trim();

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
  }

  await connectDB();
  const product = await Product.findById(id);

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}

export async function PUT(req: Request, context: any) {
  const params = await context.params;
  const id = String(params.id).trim();
  const body = await req.json();

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
  }

  await connectDB();

  const updated = await Product.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true }
  );

  if (!updated) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(req: Request, context: any) {
  const params = await context.params;
  const id = String(params.id).trim();

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
  }

  await connectDB();

  const deleted = await Product.findByIdAndDelete(id);

  if (!deleted) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}