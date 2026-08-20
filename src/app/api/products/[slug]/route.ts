import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api-helpers";
import { getProductBySlug } from "@/lib/data";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return apiError("Product slug is required", 400);
    }

    const product = await getProductBySlug(slug);

    if (!product) {
      return apiError("Product not found", 404);
    }

    return apiSuccess({ product });
  } catch (error) {
    console.error("GET /api/products/[slug] error:", error);
    return apiError("Failed to fetch product", 500);
  }
}
