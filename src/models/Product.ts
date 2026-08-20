import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import { PRODUCT_CONDITIONS, PRODUCT_STATUSES } from "@/lib/constants";

const ProductSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    slug: { type: String, required: true, unique: true, index: true },
    sku: { type: String, trim: true, index: true },
    description: { type: String, default: "" },
    shortDescription: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    salePrice: { type: Number, min: 0 },
    category: { type: String, required: true, index: true },
    subcategory: { type: String },
    condition: {
      type: String,
      enum: PRODUCT_CONDITIONS,
      default: "Good",
      index: true,
    },
    quantity: { type: Number, default: 1, min: 0 },
    images: [
      {
        url: { type: String, required: true },
        alt: { type: String },
        fileId: { type: String },
      },
    ],
    thumbnail: { type: String },
    status: {
      type: String,
      enum: PRODUCT_STATUSES,
      default: "draft",
      index: true,
    },
    featured: { type: Boolean, default: false, index: true },
    isNew: { type: Boolean, default: false, index: true },
    isSale: { type: Boolean, default: false, index: true },
    tags: [{ type: String, trim: true }],
    specifications: { type: Map, of: String, default: {} },
    dimensions: {
      width: String,
      height: String,
      depth: String,
      weight: String,
    },
    pickupOnly: { type: Boolean, default: true },
    pickupInstructions: { type: String, default: "" },
    metaTitle: { type: String },
    metaDescription: { type: String },
  },
  { timestamps: true, suppressReservedKeysWarning: true },
);

ProductSchema.index({ name: "text", description: "text", tags: "text", sku: "text" });
ProductSchema.index({ createdAt: -1 });
ProductSchema.index({ price: 1 });

export type ProductDocument = InferSchemaType<typeof ProductSchema> & {
  _id: mongoose.Types.ObjectId;
};

const Product =
  (mongoose.models.Product as Model<ProductDocument>) ||
  mongoose.model<ProductDocument>("Product", ProductSchema);

export default Product;
