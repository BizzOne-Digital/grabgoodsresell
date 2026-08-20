import { NextRequest } from "next/server";
import {
  apiError,
  apiSuccess,
  getQueryParams,
  queryProducts,
} from "@/lib/api-helpers";

export async function GET(request: NextRequest) {
  try {
    const params = getQueryParams(request);
    const result = await queryProducts(params);
    return apiSuccess(result);
  } catch (error) {
    console.error("GET /api/products error:", error);
    return apiError("Failed to fetch products", 500);
  }
}
