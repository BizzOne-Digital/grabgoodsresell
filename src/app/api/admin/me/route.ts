import { requireAdminSession } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/api-helpers";

export async function GET() {
  try {
    const session = await requireAdminSession();
    return apiSuccess({
      authenticated: true,
      role: session.role,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return apiError("Unauthorized", 401);
    }
    return apiError("Session check failed", 500);
  }
}
