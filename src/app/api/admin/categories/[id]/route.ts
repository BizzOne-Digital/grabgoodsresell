import { NextRequest } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/api-helpers";
import { categorySchema } from "@/lib/validations";
import { slugifyText } from "@/lib/utils";
import connectDB from "@/lib/db";
import Category from "@/models/Category";

async function generateUniqueSlug(baseSlug: string, excludeId: string) {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await Category.findOne({
      slug,
      _id: { $ne: excludeId },
    })
      .select("_id")
      .lean();

    if (!existing) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdminSession();
    const { id } = await params;
    const body = await request.json();
    const parsed = categorySchema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.issues[0]?.message || "Validation failed", 400);
    }

    await connectDB();

    const slug = await generateUniqueSlug(
      parsed.data.slug || slugifyText(parsed.data.name),
      id,
    );

    const category = await Category.findByIdAndUpdate(
      id,
      { ...parsed.data, slug },
      { returnDocument: "after", runValidators: true },
    ).lean();

    if (!category) {
      return apiError("Category not found", 404);
    }

    return apiSuccess(JSON.parse(JSON.stringify(category)));
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return apiError("Unauthorized", 401);
    }
    if (error instanceof Error && "code" in error && (error as { code: number }).code === 11000) {
      return apiError("Category name or slug already exists", 409);
    }
    return apiError("Failed to update category", 500);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdminSession();
    const { id } = await params;

    await connectDB();
    const category = await Category.findByIdAndDelete(id).lean();

    if (!category) {
      return apiError("Category not found", 404);
    }

    return apiSuccess({ deleted: true, category: JSON.parse(JSON.stringify(category)) });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return apiError("Unauthorized", 401);
    }
    return apiError("Failed to delete category", 500);
  }
}
