import asyncHandler from "express-async-handler";
import { Product } from "../models/product.model";
import { User } from "../models/user.model";
// Create Prouct

export const createProduct = asyncHandler(async (req: any, res: any) => {
  const { amountAvailable, cost, description, productName } = req.body;

  // Validate that user is a seller
  const { id } = req.user;
  const sellerId = id;

  const user = await User.findOne({ _id: id }).populate("role").exec();

  if (!user) {
    return res.status(404).json({
      message: `User with id ${id} not found.`,
    });
  }
  // Extract role
  const { role } = user;

  //   Validations
  if (role !== "seller") {
    return res.status(400).json({ error: "Only sellers can create products." });
  }

  //   Validation
  if (!productName || !amountAvailable || !cost || !description || !sellerId) {
    return res.status(400).json({ message: "Please fill in all fields" });
  }

  // Create Product
  const product = await Product.create({
    sellerId,
    productName,
    amountAvailable,
    cost,
    description,
  });

  return res.status(201).json(product);
});

// Get all Products
export const getProducts = asyncHandler(async (_req: any, res: any) => {
  // eslint-disable-next-line max-len
  const products = await Product.find({}).sort("-createdAt");

  res.status(200).json(products);
});

// Get single product
const getAProd = asyncHandler(async (req: any, res: any) => {
  const product = await Product.findById(req.params.id);
  // if product doesnt exist

  if (!product) {
    res.status(404).send({ message: "Product not found" });
  }
  res.status(200).json(product);
});

// Delete Product
export const deleteProduct = asyncHandler(async (req: any, res: any) => {
  const product = await Product.findById(req.params.id);
  // if product doesnt exist

  console.log("User: ", req.user);

  if (!product) {
    res.status(404).send({ message: "Product not found" });
  }
  // Match product to its user
  if (product?.sellerId.toString() !== req.user.id) {
    res.status(401).send({ message: "User not authorized" });
  }
  await product?.remove();
  res.status(200).json({ message: "Product deleted." });
});

// Update Product
export const updateProduct = asyncHandler(async (req: any, res: any) => {
  const { amountAvailable, cost, description, productName } = req.body;
  const { id } = req.params;

  const product = await Product.findById(id);

  // if product doesnt exist
  if (!product) {
    res.status(404).send({ message: "Product not found" });
  }
  // Match product to its user
  if (product?.sellerId.toString() !== req.user.id) {
    res.status(401).send({ message: "User not authorized" });
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

  res.status(200).json(updatedProduct);
});

export default {
  createProduct,
  getProducts,
  getAProd,
  deleteProduct,
  updateProduct,
};
