import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Seller from "@/app/models/seller";
import connectDB from "@/app/config/db";

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

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await context.params;
    const id = rawId.trim();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid seller ID format" },
        { status: 400 }
      );
    }

    await connectDB();

    const data = await req.json();

    const seller = await Seller.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    });

    if (!seller) {
      return NextResponse.json(
        { error: "Seller not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(seller);
  } catch (error) {
    console.error("Update seller error:", error);
    return NextResponse.json(
      { error: "An error occurred" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await context.params;
    const id = rawId.trim();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid seller ID format" },
        { status: 400 }
      );
    }

    await connectDB();

    const seller = await Seller.findByIdAndDelete(id);

    if (!seller) {
      return NextResponse.json(
        { error: "Seller not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Seller deleted successfully" });
  } catch (error) {
    console.error("Delete seller error:", error);
    return NextResponse.json(
      { error: "An error occurred" },
      { status: 500 }
    );
  }
}