import { NextRequest } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/api-helpers";
import { orderStatusSchema } from "@/lib/validations";
import connectDB from "@/lib/db";
import Order from "@/models/Order";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdminSession();
    const { id } = await params;

    await connectDB();
    const order = await Order.findById(id).lean();

    if (!order) {
      return apiError("Order not found", 404);
    }

    return apiSuccess(JSON.parse(JSON.stringify(order)));
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return apiError("Unauthorized", 401);
    }
    return apiError("Failed to fetch order", 500);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdminSession();
    const { id } = await params;
    const body = await request.json();
    const parsed = orderStatusSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.issues[0]?.message || "Validation failed", 400);
    }

    await connectDB();

    const update: Record<string, string> = { status: parsed.data.status };
    if (parsed.data.paymentStatus) {
      update.paymentStatus = parsed.data.paymentStatus;
    }

    const order = await Order.findByIdAndUpdate(id, update, { returnDocument: "after" }).lean();

    if (!order) {
      return apiError("Order not found", 404);
    }

    return apiSuccess(JSON.parse(JSON.stringify(order)));
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return apiError("Unauthorized", 401);
    }
    return apiError("Failed to update order", 500);
  }
}
