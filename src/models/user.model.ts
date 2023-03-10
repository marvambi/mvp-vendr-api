// src/models/user.model.ts

import mongoose, { Schema, Model, Document } from "mongoose";

type UserDocument = Document & {
  username: string;
  email: string;
  password: string;
  enabled: string;
  deposit: number;
  role: string;
  hash: string;
  salt: string;
};

type UserInput = {
  username: UserDocument["username"];
  email: UserDocument["email"];
  password: UserDocument["password"];
  enabled: UserDocument["enabled"];
  role: UserDocument["role"];
  deposit: UserDocument["deposit"];
  salt: UserDocument["salt"];
};

const usersSchema = new Schema(
  {
    username: {
      type: Schema.Types.String,
      required: true,
    },
    email: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
    password: {
      type: Schema.Types.String,
      required: true,
    },
    enabled: {
      type: Schema.Types.Boolean,
      default: true,
    },
    deposit: {
      type: Schema.Types.Number,
      default: 0,
      required: true,
    },
    role: {
      type: Schema.Types.String,
      default: "seller",
      required: true,
      index: true,
    },
    hash: {
      type: Schema.Types.String,
    },
    salt: {
      type: Schema.Types.String,
    },
  },
  {
    collection: "users",
    timestamps: true,
  }
);

// eslint-disable-next-line max-len
const User: Model<UserDocument> = mongoose.model<UserDocument>(
  "User",
  usersSchema
);

export { User, UserInput, UserDocument };
