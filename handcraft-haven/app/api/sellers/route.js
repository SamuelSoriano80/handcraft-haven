import { NextResponse } from "next/server";
import connectDB from "../../config/db";
import Seller from "../../models/seller";

export async function GET() {
  await connectDB();
  const sellers = await Seller.find();
  return NextResponse.json(sellers);
}

export async function POST(req) {
  await connectDB();
  const data = await req.json();
  const seller = await Seller.create(data);
  return NextResponse.json(seller);
}
