import { NextResponse } from "next/server";
import connectDB from "../../../config/db";
import Seller from "../../../models/seller";

export async function POST(req) {
  try {
    await connectDB();
    const { name, password } = await req.json();

    // Validate inputs
    if (!name || !password) {
      return NextResponse.json(
        { error: "Name and password are required" },
        { status: 400 }
      );
    }

    // Find seller by name
    const seller = await Seller.findOne({ name });

    // Check if seller exists and password matches
    if (!seller || seller.password !== password) {
      return NextResponse.json(
        { error: "Invalid name or password" },
        { status: 401 }
      );
    }

    // Return seller data (without password)
    const { password: _, ...sellerData } = seller.toObject();
    return NextResponse.json(sellerData);
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "An error occurred during login" },
      { status: 500 }
    );
  }
}
