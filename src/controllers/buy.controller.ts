import asyncHandler from "express-async-handler";
import dotenv from "dotenv";
dotenv.config();
import { User } from "../models/user.model";
import { Product } from "../models/product.model";

const buyProduct = asyncHandler(async (req: any, res: any) => {
  try {
    const { amount, productId } = req.body;
    const userId = req.user.id;

    // Find the product by ID
    const product = await Product.findById(productId);

    // Check if the product exists and has enough amount available
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    if (Number.parseInt(product.amountAvailable) < amount) {
      return res.status(400).json({ error: "Not enough products available" });
    }

    // Calculate the total cost of products buyer sent
    const totalCost = Number.parseInt(product.cost) * Number.parseInt(amount);

    // Find the user by ID
    const user = await User.findById(userId);

    // Check if the user exists and has enough deposit
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (user.deposit < totalCost) {
      return res.status(400).json({ error: "Not enough deposit" });
    }

    // Calculate the change due
    let change = user.deposit - totalCost;
    const coins = [100, 50, 20, 10, 5];
    const changeCoins: number[] = [];

    coins.forEach((coin) => {
      const count = Math.floor(change / coin);

      for (let i = 0; i < count; i++) {
        changeCoins.push(coin);
      }
      change -= count * coin;
    });

    // Update the product amount and user deposit
    // eslint-disable-next-line max-len
    const new_amount_available =
      Number.parseInt(product.amountAvailable) - Number.parseInt(amount);

    await Product.updateOne(
      { _id: productId },
      { amountAvailable: new_amount_available }
    );

    // eslint-disable-next-line max-len
    const new_deposit = user.deposit - totalCost;

    await User.updateOne({ _id: userId }, { deposit: new_deposit });

    // Return the response
    res.json({
      total: totalCost,
      products: product.productName,
      change: changeCoins,
    });
  } catch (error) {
    res.status(400).json({ message: "Product purchase failed" });
  }
});

export default buyProduct;
