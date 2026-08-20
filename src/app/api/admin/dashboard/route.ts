import { requireAdminSession } from "@/lib/auth";
import { getAdminStats } from "@/lib/data";
import { apiError, apiSuccess } from "@/lib/api-helpers";

export async function GET() {
  try {
    await requireAdminSession();
    const stats = await getAdminStats();
    return apiSuccess(stats);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return apiError("Unauthorized", 401);
    }
    return apiError("Failed to load dashboard stats", 500);
  }
}
