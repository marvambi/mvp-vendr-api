import asyncHandler from "express-async-handler";
import dotenv from "dotenv";
dotenv.config();
import { User } from "../models/user.model";

const createUserDeposit = asyncHandler(async (req: any, res: any) => {
  try {
    const { deposit } = req.body;

    // Validate user first

    const { id } = req.user;

    const user = await User.findOne({ _id: id }).populate("role").exec();

    if (!user) {
      return res.status(404).json({
        message: `User with id ${id} not found.`,
      });
    }
    // Extract role
    const { _id, role } = user;

    //   Validations
    if (role !== "buyer") {
      res.status(400).send({ error: "Only buyers can make deposits." });
    }

    // Check if deposit amount is valid
    const validCoins = [5, 10, 20, 50, 100];

    if (!validCoins.includes(deposit)) {
      return res.status(400).json({
        error: "Invalid coin value. Please use 5, 10, 20, 50, or 100.",
      });
    }

    const new_deposit_value: number = user.deposit + deposit;

    await User.updateOne({ _id }, { deposit: new_deposit_value });

    // const userUpdated = await User.findById(id);

    return res.status(200).json({
      // eslint-disable-next-line max-len
      message: `${deposit} cents was successfully deposited into your account`,
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
});

export default createUserDeposit;
