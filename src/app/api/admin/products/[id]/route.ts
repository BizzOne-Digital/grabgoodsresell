import { NextRequest } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/api-helpers";
import { productSchema } from "@/lib/validations";
import { slugifyText } from "@/lib/utils";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

async function generateUniqueSlug(baseSlug: string, excludeId: string) {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await Product.findOne({
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

function prepareProductFields(data: ReturnType<typeof productSchema.parse>) {
  const slug = data.slug || slugifyText(data.name);
  const thumbnail = data.thumbnail || data.images[0]?.url;

  return {
    ...data,
    slug,
    thumbnail,
  };
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdminSession();
    const { id } = await params;

    await connectDB();
    const product = await Product.findById(id).lean();

    if (!product) {
      return apiError("Product not found", 404);
    }

    return apiSuccess(JSON.parse(JSON.stringify(product)));
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return apiError("Unauthorized", 401);
    }
    return apiError("Failed to fetch product", 500);
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
    const parsed = productSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.issues[0]?.message || "Validation failed", 400);
    }

    await connectDB();

    const existing = await Product.findById(id);
    if (!existing) {
      return apiError("Product not found", 404);
    }

    const fields = prepareProductFields(parsed.data);
    fields.slug = await generateUniqueSlug(fields.slug, id);

    Object.assign(existing, fields);
    await existing.save();

    return apiSuccess(JSON.parse(JSON.stringify(existing.toObject())));
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return apiError("Unauthorized", 401);
    }
    return apiError("Failed to update product", 500);
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
    const product = await Product.findByIdAndUpdate(
      id,
      { status: "archived" },
      { returnDocument: "after" },
    ).lean();

    if (!product) {
      return apiError("Product not found", 404);
    }

    return apiSuccess(JSON.parse(JSON.stringify(product)));
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return apiError("Unauthorized", 401);
    }
    return apiError("Failed to archive product", 500);
  }
}
