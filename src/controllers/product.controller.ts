import asyncHandler from 'express-async-handler';
import { Product } from '../models/product.model';
// Create Prouct

export const createProduct = asyncHandler(async (req: any, res: any) => {
  const { description, productName, cost, amountAvailable, sellerId } = req.body;

  //   Validation
  if (!productName || !amountAvailable || !cost || !description || !sellerId) {
    res.status(400);
    throw new Error('Please fill in all fields');
  }
  // Create Product
  const product = await Product.create({
    sellerId,
    productName,
    amountAvailable,
    cost,
    description,
  });

  res.status(201).json(product);
});

// Get all Products
export const getProducts = asyncHandler(async (req: any, res: any) => {
  const products = await Product.find({ user: req.user.id }).sort('-createdAt');

  res.status(200).json(products);
});

// Get single product
const getAProd = asyncHandler(async (req: any, res: any) => {
  const product = await Product.findById(req.params.id);
  // if product doesnt exist

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.status(200).json(product);
});

// Delete Product
export const deleteProduct = asyncHandler(async (req: any, res: any) => {
  const product = await Product.findById(req.params.id);
  // if product doesnt exist

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  // Match product to its user
  if (product.sellerId.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }
  await product.remove();
  res.status(200).json({ message: 'Product deleted.' });
});

// Update Product
export const updateProduct = asyncHandler(async (req: any, res: any) => {
  const { description, productName, cost, amountAvailable } = req.body;
  const { id } = req.params;

  const product = await Product.findById(id);

  // if product doesnt exist
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  // Match product to its user
  if (product.sellerId.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
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
    },
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
