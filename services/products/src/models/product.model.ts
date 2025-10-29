import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
  ratingsAverage: number;
  ratingsQuantity: number;
}

const productSchema: Schema<IProduct> = new Schema(
  {
    name: {
      type: String,
      required: [true, "A product must have a name"],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, "A product must have a description"],
    },
    price: {
      type: Number,
      required: [true, "A product must have a price"],
      min: [0, "Price cannot be Negative"],
    },
    category: {
      type: String,
      required: [true, "A product must have a category"],
      lowercase: true,
    },
    stock: {
      type: Number,
      required: [true, "A product must have a stock quantity"],
      default: 0,
      min: [0, "Stock cannot be negative"],
    },
    ratingsAverage: {
      type: Number,
      default: 0,
      min: [0, "Rating must be above 0"],
      max: [5, "Rating cannot exceed 5"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
      min: [0, "Ratings quantity cannot be negative"],
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index(
  { name: "text", description: "text" }
  // { weights: { name: 5, description: 1 } }
);

productSchema.index({ category: 1 });
productSchema.index({ price: 1 });

export const Product = mongoose.model<IProduct>("Product", productSchema);

// 1. Product REST API Routes
// HTTP Method	Endpoint	Description	Auth / Role
// POST	/api/products	Create a new product	Admin only
// GET	/api/products	Get all products (with optional filters, search, pagination)	Public
// GET	/api/products/:id	Get a single product by ID	Public
// PATCH	/api/products/:id	Update a product	Admin only
// DELETE	/api/products/:id	Delete a product	Admin only
// 2. Optional Additional Routes
// HTTP Method	Endpoint	Description	Auth / Role
// GET	/api/products/category/:category	Get all products in a category	Public
// GET	/api/products/search/:keyword	Search products by name or description	Public
// GET	/api/products/featured	Get featured products	Public
