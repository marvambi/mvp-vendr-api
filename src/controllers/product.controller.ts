import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { Product } from "../models/product.model";
import { User } from "../models/user.model";

import dotenv from "dotenv";
const envs = dotenv.config();
// Create Prouct

export const createProduct = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { amountAvailable, cost, description, productName } = req.body;

  // Validate that user is a seller
  const { token } = req.cookies;

  let verified: any;

  const secrets: any = envs.parsed?.JWT_SECRET;

  if (token) {
    verified = jwt.verify(token, secrets);
  }

  let sellerId: string;
  let user: any;

  if (verified?.id !== undefined) {
    sellerId = verified?.id;
    user = await User.findOne({ _id: sellerId }).populate("role").exec();
  }

  if (!user) {
    return res.status(404).json({
      message: `User not found.`,
    });
  }
  // Extract role
  const { _id, role } = user;

  sellerId = _id;
  //   Validations

  if (role !== "seller") {
    return res.status(400).json({ error: "Only sellers can create products." });
  }

  //   Validation
  if (!productName || !amountAvailable || !cost || !description || !_id) {
    return res.status(400).json({ message: "Please fill in all fields" });
  }

  // Create Product

  const product = await Product.init().then(() =>
    Product.create({
      sellerId,
      productName,
      amountAvailable,
      cost,
      description,
    })
  );

  return res.status(201).json(product);
};

// Get all Products
export const getProducts = asyncHandler(
  async (_req: Request, res: Response) => {
    const products = await Product.find({}).sort("-createdAt");
    const the_prods: Array<any> = [];

    products.forEach((product) => {
      const { _id, amountAvailable, cost, description, productName, sellerId } =
        product;

      the_prods.push({
        _id,
        sellerId,
        productName,
        amountAvailable,
        cost,
        description,
      });
    });
    res.status(200).json(the_prods);
  }
);

// Get single product
const getAProd = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id);
  // if product doesnt exist

  if (!product) {
    res.status(404).send({ message: "Product not found" });
  }
  const returnable_product = {
    _id: product?._id,
    amountAvailable: product?.amountAvailable,
    cost: product?.cost,
    description: product?.description,
    productName: product?.productName,
    sellerId: product?.sellerId,
  };

  res.status(200).json(returnable_product);
});

// Delete Product
export const deleteProduct = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    // Validate that user is a seller
    const { token } = req.cookies;
    const { id } = req.params;

    let verified: any;

    const secrets: any = envs.parsed?.JWT_SECRET;

    if (token) {
      verified = jwt.verify(token, secrets);
    }

    let sellerId: string;
    let user: any;

    if (verified?.id !== undefined) {
      sellerId = verified?.id;
      user = await User.findOne({ _id: sellerId }).populate("role").exec();
    }

    if (!user) {
      return res.status(404).json({ message: `User not found.` });
    }
    // Extract role
    const { _id, role } = user;

    sellerId = _id;
    //   Validations

    if (role !== "seller") {
      return res
        .status(400)
        .json({ error: "Only sellers can delete products." });
    }

    const product = await Product.findById(id);
    // if product doesnt exist

    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }
    // Match product to its user
    if (product?.sellerId.toString() !== id) {
      return res.status(401).send({
        message: `You're not authorized on this product`,
      });
    }
    await product?.remove();
    return res.status(200).json({ message: "Product deleted." });
  }
);

// Update Product
export const updateProduct = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { amountAvailable, cost, description, productName } = req.body;
    const { id } = req.params;
    // Validate that user is a seller
    const { token } = req.cookies;

    let verified: any;

    const secrets: any = envs.parsed?.JWT_SECRET;

    if (token) {
      verified = jwt.verify(token, secrets);
    }
    let sellerId: string;
    let user: any;

    if (verified?.id !== undefined) {
      sellerId = verified?.id;
      user = await User.findOne({ _id: sellerId }).populate("role").exec();
    }

    // Extract role
    const { _id, role } = user;

    sellerId = _id;
    //   Validations
    if (!user) {
      return res.status(404).json({ message: `User not found.` });
    }
    // Extract role
    if (role !== "seller") {
      return res
        .status(400)
        .json({ error: "Only sellers can delete products." });
    }
    const product = await Product.findById(id);

    // if product doesnt exist
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }
    // Match product to its user
    if (product?.sellerId.toString() !== sellerId) {
      return res.status(401).send({ message: "User not authorized" });
    }

    // Update Product
    const updatedProduct = await Product.findByIdAndUpdate(
      { _id: id },
      {
        productName,
        amountAvailable,
        cost,
        description,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json(updatedProduct);
  }
);

export default {
  createProduct,
  getProducts,
  getAProd,
  deleteProduct,
  updateProduct,
};
