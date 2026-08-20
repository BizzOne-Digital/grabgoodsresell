import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api-helpers";
import { getPublishedTestimonials } from "@/lib/data";

export async function GET(request: NextRequest) {
  try {
    const limitParam = new URL(request.url).searchParams.get("limit");
    let limit: number | undefined;

    if (limitParam) {
      limit = parseInt(limitParam, 10);
      if (Number.isNaN(limit) || limit < 1) {
        return apiError("Invalid limit parameter", 400);
      }
    }

    const testimonials = await getPublishedTestimonials(limit);
    return apiSuccess({ testimonials });
  } catch (error) {
    console.error("GET /api/testimonials error:", error);
    return apiError("Failed to fetch testimonials", 500);
  }
}
