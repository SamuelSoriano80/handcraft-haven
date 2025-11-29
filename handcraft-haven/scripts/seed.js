import mongoose from "mongoose";
import dotenv from "dotenv";
import Seller from "../app/models/seller.js";
import Product from "../app/models/product.js";

dotenv.config({ path: ".env" });

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Clear previous data
    await Seller.deleteMany();
    await Product.deleteMany();

    // Create sellers
    const sellers = await Seller.insertMany([
      {
        name: "Ana López",
        biography: "Mexican artisan specializing in handcrafted pottery.",
        email: "ana@example.com",
        password: "temppass",
        avatar: "/seller-1.jpg"
      },
      {
        name: "David Ramírez",
        biography: "Woodworker creating unique carved wooden figures.",
        email: "david@example.com",
        password: "temppass",
        avatar: "/seller-2.jpg"
      }
    ]);

    console.log("Sellers seeded");

    // Create products
    const products = await Product.insertMany([
      {
        name: "Handmade Pottery Vase",
        description: "A beautiful handcrafted vase made with traditional techniques.",
        price: 45.00,
        image: "/product-1.jpg",
        seller: sellers[0]._id
      },
      {
        name: "Carved Wooden Fox",
        description: "A carefully carved fox using premium woods.",
        price: 65.00,
        image: "/product-2.jpg",
        seller: sellers[1]._id
      },
      {
        name: "Artisan Ceramic Bowl",
        description: "A unique ceramic bowl with natural colors.",
        price: 35.00,
        image: "/product-3.jpg",
        seller: sellers[0]._id
      }
    ]);

    console.log("Products seeded");

    await mongoose.connection.close();
    console.log("Database seeding finished & connection closed");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
