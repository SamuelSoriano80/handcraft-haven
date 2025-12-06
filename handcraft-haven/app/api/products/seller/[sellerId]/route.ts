import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Product from "@/app/models/product";

const MONGO_URI = process.env.MONGO_URI!;

export async function GET(
  req: Request,
  { params }: { params: { sellerId: string } }
) {
  // In app-route handlers `params` may be a Promise; await it first.
  const resolvedParams = await params;
  const rawSellerId = resolvedParams?.sellerId;
  console.log("products route params:", resolvedParams);
  console.log("RAW SELLER ID:", rawSellerId);

  const sellerId = (typeof rawSellerId === "string" ? rawSellerId : String(rawSellerId || "")).trim();
  console.log("TRIMMED SELLER ID:", sellerId);

  if (!mongoose.Types.ObjectId.isValid(sellerId)) {
    console.log("Invalid sellerId format, returning empty list");
    return NextResponse.json([]);
  }

  await mongoose.connect(MONGO_URI);

  const products = await Product.find({ seller: sellerId });

  return NextResponse.json(products);
}
