import { NextRequest } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/api-helpers";
import { testimonialSchema } from "@/lib/validations";
import connectDB from "@/lib/db";
import Testimonial from "@/models/Testimonial";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdminSession();
    const { id } = await params;
    const body = await request.json();
    const parsed = testimonialSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.issues[0]?.message || "Validation failed", 400);
    }

    await connectDB();

    const data = {
      ...parsed.data,
      date: parsed.data.date ? new Date(parsed.data.date) : undefined,
    };

    const testimonial = await Testimonial.findByIdAndUpdate(id, data, {
      returnDocument: "after",
      runValidators: true,
    }).lean();

    if (!testimonial) {
      return apiError("Testimonial not found", 404);
    }

    return apiSuccess(JSON.parse(JSON.stringify(testimonial)));
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return apiError("Unauthorized", 401);
    }
    return apiError("Failed to update testimonial", 500);
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
    const testimonial = await Testimonial.findByIdAndDelete(id).lean();

    if (!testimonial) {
      return apiError("Testimonial not found", 404);
    }

    return apiSuccess({ deleted: true, testimonial: JSON.parse(JSON.stringify(testimonial)) });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return apiError("Unauthorized", 401);
    }
    return apiError("Failed to delete testimonial", 500);
  }
}
