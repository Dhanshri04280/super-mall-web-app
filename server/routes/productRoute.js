import express from "express";
import { upload } from "../configs/multer.js";
import authSeller from "../middlewares/authSeller.js";
import {
  addProduct,
  changeStock,
  productById,
  productList,
} from "../controllers/productController.js";

const productRouter = express.Router();

/* =========================
   ADD PRODUCT
========================= */
productRouter.post(
  "/add",
  authSeller,
  upload.array("images", 5), // ✅ FIXED
  addProduct
);

/* =========================
   GET ALL PRODUCTS
========================= */
productRouter.get("/list", productList);

/* =========================
   GET PRODUCT BY ID
========================= */
productRouter.post("/id", productById); // ✅ FIXED (POST)

/* =========================
   UPDATE STOCK
========================= */
productRouter.post("/stock", authSeller, changeStock);

export default productRouter;
