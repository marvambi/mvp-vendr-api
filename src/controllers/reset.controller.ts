import asyncHandler from "express-async-handler";
import dotenv from "dotenv";
dotenv.config();
import { User } from "../models/user.model";

const resetUserDeposit = asyncHandler(async (req: any, res: any) => {
  try {
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
      res.status(400).send({
        error: "Only buyers can reset their deposit accounts.",
      });
    }

    await User.updateOne({ _id }, { deposit: 0 });

    // const userUpdated = await User.findById(id);

    return res.status(200).json({
      message: "You have successfully reset your deposit account",
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
});

export default resetUserDeposit;
