import asyncHandler from "express-async-handler";
import { User } from "../models/user.model";
import jwt from "jsonwebtoken";

const authr = asyncHandler(async (req: any, res: any, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      res.status(401).send({ message: "No authorization token, please login" });
    }

    // Verify Token
    const verified: any = jwt.verify(token, "5ytjjfbPK8ZJ");
    // Get user id from token
    // es-lint disable next line

    const user = await User.findById(verified.id).select("-password");

    if (!user) {
      res.status(401).send({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401);
    throw new Error(`Error: ${error}`);
  }
});

export default authr;
