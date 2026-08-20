import { NextRequest } from "next/server";
import {
  verifyAdminPassword,
  createAdminSession,
} from "@/lib/auth";
import { loginSchema } from "@/lib/validations";
import { apiError, apiSuccess } from "@/lib/api-helpers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.issues[0]?.message || "Validation failed", 400);
    }

    const valid = await verifyAdminPassword(parsed.data.password);

    if (!valid) {
      return apiError("Invalid password", 401);
    }

    await createAdminSession();

    return apiSuccess({ authenticated: true });
  } catch {
    return apiError("Login failed", 500);
  }
}
