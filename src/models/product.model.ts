import mongoose, { Document, Model } from "mongoose";

type ProductDocument = Document & {
  productName: string;
  sellerId: string;
  cost: number;
  amountAvailable: number;
  description: string | null;
};

type ProductInput = {
  productName: ProductDocument["productName"];
  sellerId: ProductDocument["sellerId"];
  cost: ProductDocument["cost"];
  amountAvailable: ProductDocument["amountAvailable"];
  description: ProductDocument["description"];
};

const productSchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    productName: {
      type: String,
      required: [true, "Please add a name"],
      unique: true,
      trim: true,
      strict: true,
    },
    amountAvailable: {
      type: mongoose.Schema.Types.Number,
      required: [true, "Please add a quantity"],
    },
    cost: {
      type: mongoose.Schema.Types.Number,
      required: [true, "Please add a price"],
    },
    description: {
      type: mongoose.Schema.Types.String,
      required: [true, "Please add a description"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);
// eslint-disable-next-line max-len
const Product: Model<ProductDocument> = mongoose.model<ProductDocument>(
  "Product",
  productSchema
);

export { Product, ProductInput, ProductDocument };
