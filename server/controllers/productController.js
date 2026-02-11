import { v2 as cloudinary } from "cloudinary";
import Product from "../models/Product.js";

/* =========================
   ADD PRODUCT
   POST /api/product/add
========================= */
export const addProduct = async (req, res) => {
  try {
    // Safety checks
    if (!req.body.productData) {
      return res.status(400).json({
        success: false,
        message: "Product data is missing",
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Product images are required",
      });
    }

    const productData = JSON.parse(req.body.productData);

    /* Upload images to Cloudinary */
    const imageUrls = await Promise.all(
      req.files.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    /* Save product to MongoDB */
    await Product.create({
      ...productData,
      image: imageUrls,
    });

    res.status(201).json({
      success: true,
      message: "Product added successfully",
    });
  } catch (error) {
    console.error("Add Product Error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   GET ALL PRODUCTS
   GET /api/product/list
========================= */
export const productList = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Product List Error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   GET PRODUCT BY ID
   POST /api/product/id
========================= */
export const productById = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Product By ID Error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   UPDATE STOCK
   POST /api/product/stock
========================= */
export const changeStock = async (req, res) => {
  try {
    const { id, inStock } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    await Product.findByIdAndUpdate(id, { inStock });

    res.status(200).json({
      success: true,
      message: "Stock updated successfully",
    });
  } catch (error) {
    console.error("Change Stock Error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
