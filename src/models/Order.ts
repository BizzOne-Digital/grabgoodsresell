import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import { ORDER_STATUSES, PAYMENT_STATUSES } from "@/lib/constants";

const OrderItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    slug: { type: String, required: true },
    price: { type: Number, required: true },
    salePrice: { type: Number },
    quantity: { type: Number, required: true, min: 1 },
    image: { type: String },
    condition: { type: String },
  },
  { _id: false },
);

const OrderSchema = new Schema(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
    items: [OrderItemSchema],
    subtotal: { type: Number, required: true },
    total: { type: Number, required: true },
    notes: { type: String, default: "" },
    pickupPreference: { type: String, default: "" },
    pickupInfo: { type: String, default: "" },
    status: {
      type: String,
      enum: ORDER_STATUSES,
      default: "pending",
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: PAYMENT_STATUSES,
      default: "unpaid",
      index: true,
    },
    paymentProvider: { type: String, default: "manual" },
    paymentTransactionId: { type: String },
    shippingMethod: { type: String, default: "pickup" },
  },
  { timestamps: true },
);

OrderSchema.index({ createdAt: -1 });

export type OrderDocument = InferSchemaType<typeof OrderSchema> & {
  _id: mongoose.Types.ObjectId;
};

const Order =
  (mongoose.models.Order as Model<OrderDocument>) ||
  mongoose.model<OrderDocument>("Order", OrderSchema);

export default Order;
