import { NextRequest } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/api-helpers";
import { siteSettingsSchema } from "@/lib/validations";
import connectDB from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";

export async function GET() {
  try {
    await requireAdminSession();
    await connectDB();

    let settings = await SiteSettings.findOne().lean();
    if (!settings) {
      settings = (await SiteSettings.create({})).toObject();
    }

    return apiSuccess(JSON.parse(JSON.stringify(settings)));
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return apiError("Unauthorized", 401);
    }
    return apiError("Failed to fetch settings", 500);
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAdminSession();
    const body = await request.json();
    const parsed = siteSettingsSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.issues[0]?.message || "Validation failed", 400);
    }

    await connectDB();

    const settings = await SiteSettings.findOneAndUpdate({}, parsed.data, {
      returnDocument: "after",
      upsert: true,
      runValidators: true,
    }).lean();

    return apiSuccess(JSON.parse(JSON.stringify(settings)));
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return apiError("Unauthorized", 401);
    }
    return apiError("Failed to update settings", 500);
  }
}
