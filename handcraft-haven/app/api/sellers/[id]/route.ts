import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Seller from "@/app/models/seller";

const MONGO_URI = process.env.MONGO_URI!;

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id: rawId } = await context.params;
  const id = rawId.trim();

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { error: "Invalid seller ID format" },
      { status: 400 }
    );
  }

  await mongoose.connect(MONGO_URI);

  const seller = await Seller.findById(id);

  if (!seller) {
    return NextResponse.json(
      { error: "Seller not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(seller);
}