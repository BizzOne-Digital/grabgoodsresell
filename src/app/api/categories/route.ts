import { apiError, apiSuccess } from "@/lib/api-helpers";
import { getCategories } from "@/lib/data";

export async function GET() {
  try {
    const categories = await getCategories();
    return apiSuccess({ categories });
  } catch (error) {
    console.error("GET /api/categories error:", error);
    return apiError("Failed to fetch categories", 500);
  }
}
