import { NextRequest } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/api-helpers";
import { faqSchema } from "@/lib/validations";
import connectDB from "@/lib/db";
import FAQ from "@/models/FAQ";

export async function GET() {
  try {
    await requireAdminSession();
    await connectDB();

    const faqs = await FAQ.find().sort({ sortOrder: 1, createdAt: -1 }).lean();
    return apiSuccess(JSON.parse(JSON.stringify(faqs)));
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return apiError("Unauthorized", 401);
    }
    return apiError("Failed to fetch FAQs", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdminSession();
    const body = await request.json();
    const parsed = faqSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.issues[0]?.message || "Validation failed", 400);
    }

    await connectDB();
    const faq = await FAQ.create(parsed.data);
    return apiSuccess(JSON.parse(JSON.stringify(faq)), 201);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return apiError("Unauthorized", 401);
    }
    return apiError("Failed to create FAQ", 500);
  }
}
