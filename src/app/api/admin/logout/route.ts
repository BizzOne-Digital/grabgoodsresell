import { clearAdminSession } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/api-helpers";

export async function POST() {
  try {
    await clearAdminSession();
    return apiSuccess({ authenticated: false });
  } catch {
    return apiError("Logout failed", 500);
  }
}
