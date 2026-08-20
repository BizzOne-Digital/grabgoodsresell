import { NextRequest } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/api-helpers";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

const bulkActionSchema = z.object({
  action: z.enum(["publish", "hide", "sold", "archive"]),
  ids: z.array(z.string().min(1)).min(1, "At least one product ID is required"),
});

const STATUS_MAP = {
  publish: "active",
  hide: "hidden",
  sold: "sold",
  archive: "archived",
} as const;

export async function POST(request: NextRequest) {
  try {
    await requireAdminSession();
    const body = await request.json();
    const parsed = bulkActionSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.issues[0]?.message || "Validation failed", 400);
    }

    await connectDB();

    const status = STATUS_MAP[parsed.data.action];
    const result = await Product.updateMany(
      { _id: { $in: parsed.data.ids } },
      { status },
    );

    return apiSuccess({
      action: parsed.data.action,
      status,
      matched: result.matchedCount,
      modified: result.modifiedCount,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return apiError("Unauthorized", 401);
    }
    return apiError("Failed to perform bulk action", 500);
  }
}
