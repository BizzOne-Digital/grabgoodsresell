import { NextRequest } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/api-helpers";
import { categorySchema } from "@/lib/validations";
import { slugifyText } from "@/lib/utils";
import connectDB from "@/lib/db";
import Category from "@/models/Category";

async function generateUniqueSlug(baseSlug: string, excludeId?: string) {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const filter: Record<string, unknown> = { slug };
    if (excludeId) {
      filter._id = { $ne: excludeId };
    }

    const existing = await Category.findOne(filter).select("_id").lean();
    if (!existing) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

export async function GET() {
  try {
    await requireAdminSession();
    await connectDB();

    const categories = await Category.find()
      .sort({ sortOrder: 1, name: 1 })
      .lean();

    return apiSuccess(JSON.parse(JSON.stringify(categories)));
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return apiError("Unauthorized", 401);
    }
    return apiError("Failed to fetch categories", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdminSession();
    const body = await request.json();
    const parsed = categorySchema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.issues[0]?.message || "Validation failed", 400);
    }

    await connectDB();

    const slug = await generateUniqueSlug(
      parsed.data.slug || slugifyText(parsed.data.name),
    );

    const category = await Category.create({
      ...parsed.data,
      slug,
    });

    return apiSuccess(JSON.parse(JSON.stringify(category)), 201);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return apiError("Unauthorized", 401);
    }
    if (error instanceof Error && "code" in error && (error as { code: number }).code === 11000) {
      return apiError("Category name or slug already exists", 409);
    }
    return apiError("Failed to create category", 500);
  }
}
