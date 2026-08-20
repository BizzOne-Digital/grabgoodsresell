import { NextRequest } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/api-helpers";
import { faqSchema } from "@/lib/validations";
import connectDB from "@/lib/db";
import FAQ from "@/models/FAQ";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdminSession();
    const { id } = await params;
    const body = await request.json();
    const parsed = faqSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.issues[0]?.message || "Validation failed", 400);
    }

    await connectDB();
    const faq = await FAQ.findByIdAndUpdate(id, parsed.data, {
      returnDocument: "after",
      runValidators: true,
    }).lean();

    if (!faq) {
      return apiError("FAQ not found", 404);
    }

    return apiSuccess(JSON.parse(JSON.stringify(faq)));
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return apiError("Unauthorized", 401);
    }
    return apiError("Failed to update FAQ", 500);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdminSession();
    const { id } = await params;

    await connectDB();
    const faq = await FAQ.findByIdAndDelete(id).lean();

    if (!faq) {
      return apiError("FAQ not found", 404);
    }

    return apiSuccess({ deleted: true, faq: JSON.parse(JSON.stringify(faq)) });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return apiError("Unauthorized", 401);
    }
    return apiError("Failed to delete FAQ", 500);
  }
}
