import { NextRequest } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/api-helpers";
import { testimonialSchema } from "@/lib/validations";
import connectDB from "@/lib/db";
import Testimonial from "@/models/Testimonial";

export async function GET() {
  try {
    await requireAdminSession();
    await connectDB();

    const testimonials = await Testimonial.find()
      .sort({ featured: -1, sortOrder: 1, createdAt: -1 })
      .lean();

    return apiSuccess(JSON.parse(JSON.stringify(testimonials)));
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return apiError("Unauthorized", 401);
    }
    return apiError("Failed to fetch testimonials", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdminSession();
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

    const testimonial = await Testimonial.create(data);
    return apiSuccess(JSON.parse(JSON.stringify(testimonial)), 201);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return apiError("Unauthorized", 401);
    }
    return apiError("Failed to create testimonial", 500);
  }
}
