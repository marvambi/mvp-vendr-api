import { Request, Response } from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import dotenv from "dotenv";

import { User, UserInput } from "../models/user.model";
import Token from "../models/token.model";

const envs = dotenv.config();
// eslint-disable-next-line max-len
const secretz: any = envs.parsed?.JWT_SECRET;
// Generate Token
const generateToken = (id: string) => {
  return jwt.sign({ id }, secretz, { expiresIn: "1d" });
};
let salt: string;
const hashPassword = (password: string) => {
  salt = crypto.randomBytes(16).toString("hex");

  // Hashing salt & password with 100 iterations, 64 length and sha512 digest
  return crypto.pbkdf2Sync(password, salt, 100, 64, `sha512`).toString(`hex`);
};

const createUser = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { email, enabled, password, role, username } = req.body;

      // Validation
      if (!email || !username || !password || !role) {
        return res.status(422).json({
          message: "The fields email, username, password and role are required",
        });
      }
      if (password.length < 6) {
        return res.status(400).json({
          message: "Password must be up to 6 characters",
        });
      }

      // check if user already exists
      const userExists = await User.findOne({ email });

      if (userExists) {
        return res.status(400).json({
          message: "Email has already been registered",
        });
      }

      const userInput: UserInput = {
        username,
        email,
        password: hashPassword(password),
        enabled,
        role,
        deposit: 0,
        salt,
      };

      const userCreated = await User.create(userInput);

      //   Generate Token
      const token = generateToken(userCreated._id);

      // Send HTTP-only cookie
      res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400),
        sameSite: "none",
        secure: true,
      });
      if (userCreated) {
        const { _id, email, enabled, role, username } = userCreated;

        return res.status(201).json({
          data: {
            _id,
            username,
            email,
            enabled,
            role,
            token,
          },
        });
      } else {
        return res.status(400).json({
          message: "Invalid user data",
        });
      }
    } catch (error) {
      return res.status(500).send("Server encountered an error");
    }
  }
);

const getAllUsers = async (_req: Request, res: Response) => {
  const users = await User.find().populate("role").sort("-createdAt").exec();

  if (!users.length) {
    return res.status(400).json({
      message: "No users found",
    });
  }

  const data = users.map((us) => {
    const { _id, email, enabled, role, username } = us;

    return { _id, email, enabled, username, user_role: role };
  });

  return res.status(200).json({ data });
};

const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await User.findOne({ _id: id }).populate("role").exec();

  if (!user) {
    return res.status(404).json({ message: `User with id "${id}" not found.` });
  }
  const { _id, email, enabled, role, username } = user;

  return res.status(200).json({
    data: {
      _id,
      username,
      email,
      enabled,
      role,
    },
  });
};

const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { enabled, role, username } = req.body;

  const user = await User.findOne({ _id: id });

  if (!user) {
    return res.status(404).json({ message: `User with id "${id}" not found.` });
  }

  if (!username || !role) {
    // eslint-disable-next-line max-len
    return res
      .status(422)
      .json({ message: "The fields fullName and role are required" });
  }

  await User.updateOne({ _id: id }, { enabled, username, role });

  const userUpdated = await User.findById(id);

  return res.status(200).json({ data: userUpdated });
};

const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  await User.findByIdAndDelete(id);

  return res.status(200).json({ message: "User deleted successfully." });
};

// Login User
const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate Request
    if (!email || !password) {
      return res.status(400).json("Please add email and password");
    }

    // Validate multiple login session

    const { token } = req.cookies;

    // Verify Token
    // const jwt_secret = "5ytjjfbPK8ZJ";
    let verified: any;

    if (token) {
      verified = jwt.verify(token, secretz);
    }

    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found, please signup",
      });
    }

    if (verified?.id !== undefined && user.id == verified?.id) {
      // Already logged in
      return res.status(400).json({
        message: "There is already an active session using your account",
      });
    }

    // User exists, check if password is correct
    const { salt } = user;

    const hash = crypto
      .pbkdf2Sync(password, salt, 100, 64, `sha512`)
      .toString(`hex`);

    if (user && hash === user.password) {
      const { _id, email, enabled, role, username } = user;

      //   Generate Token
      const token = generateToken(_id);

      // Send HTTP-only cookie
      res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400), // 1 day
        sameSite: "none",
        secure: true,
      });

      return res.status(200).json({
        data: {
          _id,
          email,
          enabled,
          username,
          role,
          token,
        },
      });
    } else {
      return res.status(400).json({ message: "Invalid email or password" });
    }
  } catch (error: any) {
    return res.status(500).send("Server encountered an error");
  }
};

// Logout User
const logout = asyncHandler(
  async (_req: Request, res: Response): Promise<any> => {
    res.cookie("token", "", {
      path: "/",
      httpOnly: true,
      expires: new Date(0),
      sameSite: "none",
      secure: true,
    });
    return res.status(200).json({ message: "Successfully Logged Out" });
  }
);

// Get Login Status
const loginStatus = async (req: Request, res: Response): Promise<any> => {
  const { token } = req.cookies;

  if (!token) {
    return res.json(false);
  }
  // Verify Token

  if (jwt.verify(token, secretz)) {
    return res.json(true);
  }
};

// Reset Password
const resetPassword = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { password } = req.body;
    const { resetToken } = req.params;

    // Hash token, then compare to Token in DB
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // fIND tOKEN in DB
    const userToken = await Token.findOne({
      token: hashedToken,
      expiresAt: { $gt: Date.now() },
    });

    if (!userToken) {
      res.status(404);
      throw new Error("Invalid or Expired Token");
    }

    // Find user
    const user = await User.findOne({ _id: userToken.userId });

    if (user) {
      user.password = hashPassword(password);
    }

    await user?.save();
    res.status(200).json({
      message: "Password Reset Successful, Please Login",
    });
  }
);

const changePassword = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const user = await User.findOne({ _id: id });
    const { oldPassword, password } = req.body;

    if (!user) {
      res.status(400);
      throw new Error("User not found, please signup");
    }
    //Validate
    if (!oldPassword || !password) {
      res.status(400).json({ message: "Please add old and new password" });
    }

    const { salt } = user;
    // check if old password matches password in DB

    const oldhash = crypto
      .pbkdf2Sync(oldPassword, salt, 100, 64, `sha512`)
      .toString(`hex`);

    // Save new password
    if (user && oldhash === user.password) {
      user.password = hashPassword(password);
      await user.save();
      res.status(200).send("Password change successful");
    } else {
      res.status(400).json({ message: "Your old password is incorrect" });
    }
  }
);

// eslint-disable-next-line max-len
export {
  createUser,
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
  loginUser,
  logout,
  loginStatus,
  changePassword,
  resetPassword,
};
