import { NextResponse } from "next/server";
import connectDB from "../../config/db";
import Seller from "../../models/seller";
import bcrypt from "bcryptjs";

export async function POST(req) {
  await connectDB();
  const { email, password, name } = await req.json();

  const existing = await Seller.findOne({ email });
  if (existing) {
    return NextResponse.json({ error: "Seller already exists" }, { status: 400 });
  }

  const hashed = await bcrypt.hash(password, 10);

  const seller = await Seller.create({
    name,
    email,
    password: hashed
  });

  return NextResponse.json(seller);
}
