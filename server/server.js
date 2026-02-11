import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";

import connectDB from "./configs/db.js";
import connectCloudinary from "./configs/cloudinary.js";

import userRouter from "./routes/userRoute.js";
import sellerRouter from "./routes/sellerRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import addressRouter from "./routes/addressRoute.js";
import orderRouter from "./routes/orderRoute.js";

import { stripeWebhooks } from "./controllers/orderController.js";

const app = express();
const port = process.env.PORT || 4000;

/* =======================
   CONNECT SERVICES FIRST
======================= */
await connectDB();
await connectCloudinary();

/* =======================
   STRIPE WEBHOOK (RAW BODY)
   MUST BE BEFORE express.json
======================= */
app.post(
  "/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhooks
);

/* =======================
   MIDDLEWARES
======================= */
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173", // ❌ removed empty string
    credentials: true,
  })
);

/* =======================
   ROUTES
======================= */
app.get("/", (req, res) => {
  res.send("API is Working");
});

app.use("/api/user", userRouter);
app.use("/api/seller", sellerRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);
app.use("/api/order", orderRouter);

/* =======================
   START SERVER
======================= */
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
