import { NextRequest } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/api-helpers";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

async function generateUniqueSlug(baseSlug: string) {
  let slug = baseSlug;
  let counter = 1;

  while (await Product.findOne({ slug }).select("_id").lean()) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdminSession();
    const { id } = await params;

    await connectDB();
    const original = await Product.findById(id).lean();

    if (!original) {
      return apiError("Product not found", 404);
    }

    const { _id, createdAt, updatedAt, ...productData } = original;
    void _id;
    void createdAt;
    void updatedAt;

    const baseSlug = `${original.slug}-copy`;
    const slug = await generateUniqueSlug(baseSlug);

    const duplicate = await Product.create({
      ...productData,
      name: `${original.name} (Copy)`,
      slug,
      sku: original.sku ? `${original.sku}-copy` : undefined,
      status: "draft",
    });

    return apiSuccess(JSON.parse(JSON.stringify(duplicate)), 201);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return apiError("Unauthorized", 401);
    }
    return apiError("Failed to duplicate product", 500);
  }
}
