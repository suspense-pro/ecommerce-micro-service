import express from "express";
import {
  bulkUpload,
  createProduct,
  getAllProducts,
} from "../controllers/product.controller";

const router = express.Router();

router.post("/", createProduct);
router.post("/bulk-upload", bulkUpload);
router.get("/", getAllProducts);

export default router;
