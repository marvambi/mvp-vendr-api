import asyncHandler from "express-async-handler";
import { User } from "../models/user.model";
import jwt from "jsonwebtoken";

const authr = asyncHandler(async (req: any, res: any, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      // eslint-disable-next-line max-len
      return res
        .status(401)
        .send({ message: "No authorization token, please login" });
    }

    // Verify Token
    const verified: any = jwt.verify(token, "5ytjjfbPK8ZJ");
    // Get user id from token
    // es-lint disable next line

    const user = await User.findById(verified?.id).select("-password");

    if (!user) {
      return res
        .status(401)
        .send({ message: "User not found, please register" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error });
  }
});

export default authr;
