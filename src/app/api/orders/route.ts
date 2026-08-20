import mongoose from "mongoose";
import { apiError, apiSuccess } from "@/lib/api-helpers";
import { getSiteSettings } from "@/lib/data";
import { getPaymentProvider } from "@/lib/payment";
import { generateOrderNumber, getEffectivePrice } from "@/lib/utils";
import { orderSchema } from "@/lib/validations";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";

export async function POST(request: Request) {
  try {
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return apiError("Invalid JSON body", 400);
    }

    const parsed = orderSchema.safeParse(body);

    if (!parsed.success) {
      const message = parsed.error.issues.map((issue) => issue.message).join(", ");
      return apiError(message, 400);
    }

    const { customer, items, notes, pickupPreference } = parsed.data;

    await connectDB();

    const orderItems: {
      productId: mongoose.Types.ObjectId;
      name: string;
      slug: string;
      price: number;
      salePrice?: number;
      quantity: number;
      image?: string;
      condition?: string;
    }[] = [];

    for (const item of items) {
      if (!mongoose.Types.ObjectId.isValid(item.productId)) {
        return apiError(`Invalid product ID: ${item.productId}`, 400);
      }

      const product = await Product.findById(item.productId);

      if (!product) {
        return apiError(`Product not found: ${item.name}`, 404);
      }

      if (product.status !== "active") {
        return apiError(`${product.name} is no longer available`, 400);
      }

      if (product.quantity < item.quantity) {
        return apiError(
          `Insufficient stock for ${product.name}. Only ${product.quantity} available.`,
          400,
        );
      }

      const serverEffectivePrice = getEffectivePrice(
        product.price,
        product.salePrice,
      );
      const clientEffectivePrice = getEffectivePrice(item.price, item.salePrice);

      if (
        Math.abs(item.price - product.price) > 0.01 ||
        Math.abs((item.salePrice ?? 0) - (product.salePrice ?? 0)) > 0.01 ||
        Math.abs(clientEffectivePrice - serverEffectivePrice) > 0.01
      ) {
        return apiError(
          `Price mismatch for ${product.name}. Please refresh and try again.`,
          400,
        );
      }

      const thumbnail =
        product.thumbnail ||
        product.images?.[0]?.url ||
        product.images?.[0]?.fileId;

      orderItems.push({
        productId: product._id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        salePrice: product.salePrice ?? undefined,
        quantity: item.quantity,
        image: thumbnail ?? undefined,
        condition: product.condition,
      });
    }

    const subtotal = orderItems.reduce(
      (sum, item) =>
        sum + getEffectivePrice(item.price, item.salePrice) * item.quantity,
      0,
    );
    const total = subtotal;

    const [settings, paymentProvider] = await Promise.all([
      getSiteSettings(),
      Promise.resolve(getPaymentProvider()),
    ]);

    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      customer,
      items: orderItems,
      subtotal,
      total,
      notes: notes ?? "",
      pickupPreference: pickupPreference ?? "",
      pickupInfo: settings.pickupInfo,
      status: "pending",
      paymentStatus: "unpaid",
      paymentProvider: paymentProvider.name,
      shippingMethod: "pickup",
    });

    return apiSuccess(
      {
        order: JSON.parse(JSON.stringify(order)),
        message: "Order placed successfully. We will confirm availability shortly.",
      },
      201,
    );
  } catch (error) {
    console.error("POST /api/orders error:", error);
    return apiError("Failed to create order", 500);
  }
}
