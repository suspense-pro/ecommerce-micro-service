import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import AppError from "../utils/appError";
import { Product } from "../models/product.model";
import fs from "fs";
import path from "path";

export const createProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, description, price, quantity, category } = req.body;

    if (
      !name ||
      !description ||
      price === undefined ||
      quantity === undefined
    ) {
      return next(
        new AppError("Name, description, price, and quantity are required", 400)
      );
    }

    const existing = await Product.findOne({ name });
    if (existing) {
      return next(new AppError("Product with name already exists", 400));
    }

    const product = await Product.create({
      name,
      description,
      price,
      quantity,
      category,
    });

    res.status(201).json({
      status: "success",
      message: "product created successfully",
      product,
    });
  }
);

export const getAllProducts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      page = 1,
      limit = 10,
      category,
      minPrice,
      maxPrice,
      search,
    } = req.query;

    const query: any = {};

    if (category) query.category = category.toString().toLowerCase();
    if (minPrice || maxPrice) query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);

    if (search && typeof search === "string" && search.trim() !== "") {
      query.$text = { $search: search.toString() };
    }

    let currentPage = Math.max(1, parseInt(page as string) || 1);
    let currentLimit = Math.max(1, parseInt(limit as string) || 10);

    const skip = (currentPage - 1) * currentLimit; // page = 2, (2 - 1) * 10

    console.log(query);

    const products = await Product.find(query)
      .skip(skip)
      .limit(Number(limit))
      .lean();

    res.status(200).json({
      status: "success",
      length: products?.length,
      products,
    });
  }
);

interface MulterRequest extends Request {
  file: any;
}

// export const bulkUpload = catchAsync(
//   async (req: MulterRequest, res: Response, next: NextFunction) => {

//     const contentType = req?.headers["content-type"];

//     if (!contentType || !contentType?.startsWith("multipart/form-data")) {
//       return res.status(400).json({
//         status: "fail",
//         message: "Content-Type must be multipart/form-data",
//       });
//     }

//     const boundaryMatch = contentType.match(/boundary=(.+)$/);
//     const boundary = boundaryMatch && boundaryMatch[1];

//     const chunks: Buffer[] = [];

//     for await (const chunk of req) {
//       chunks.push(chunk);
//     }
//     const buffer = Buffer.concat(chunks);

//     const body = buffer.toString("binary");

//     const parts = body.split(`--${boundary}`);
//     const filePart = parts.filter((p) => p.includes('filename="'))[0];

//     const headerEnd = filePart.indexOf("\r\n\r\n");
//     const headers = filePart.slice(0, headerEnd);
//     let fileData = filePart.slice(headerEnd + 4);
//     fileData = fileData.trimEnd();

//     const filenameMatch = headers.match(/filename="(.+?)"/);
//     const filename = filenameMatch ? filenameMatch[1] : "uploaded.csv";

//     const uploadDir = path.join(__dirname, "uploads");
//     if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
//     const filePath = path.join(uploadDir, filename);

//     fs.writeFileSync(filePath, fileData, "binary");

//     if (!filePart) {
//       return res.status(400).json({
//         status: "fail",
//         message: "No file field found in form data",
//       });
//     }

//     res.status(200).json({
//       status: "success",
//       messsage: "file uploaded successfully",
//       dir: __dirname,
//       file: req?.file || "empty",
//       contentType,
//       filePath,
//     });
//   }
// );

export const bulkUpload = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const uploadDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Generate a timestamped filename
    const fileName = `uploaded_${Date.now()}.csv`; // adjust extension if needed
    const filePath = path.join(uploadDir, fileName);

    // Create a write stream to save the file
    const writeStream = fs.createWriteStream(filePath);

    // Pipe request directly to file
    req.pipe(writeStream);

    req.on("end", () => {
      res.status(200).json({
        status: "success",
        message: "File uploaded successfully",
        filePath,
      });
    });

    req.on("error", (err) => {
      writeStream.end();
      next(err);
    });
  }
);
