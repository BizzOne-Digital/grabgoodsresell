import { NextRequest } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import {
  queryProducts,
  getQueryParams,
  apiError,
  apiSuccess,
} from "@/lib/api-helpers";
import { productSchema } from "@/lib/validations";
import { slugifyText } from "@/lib/utils";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

async function generateUniqueSlug(baseSlug: string, excludeId?: string) {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const filter: Record<string, unknown> = { slug };
    if (excludeId) {
      filter._id = { $ne: excludeId };
    }

    const existing = await Product.findOne(filter).select("_id").lean();
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

export async function GET(request: NextRequest) {
  try {
    await requireAdminSession();
    const params = getQueryParams(request);
    const result = await queryProducts(params, true);
    return apiSuccess(result);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return apiError("Unauthorized", 401);
    }
    return apiError("Failed to fetch products", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdminSession();
    const body = await request.json();
    const parsed = productSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.issues[0]?.message || "Validation failed", 400);
    }

    await connectDB();

    const fields = prepareProductFields(parsed.data);
    fields.slug = await generateUniqueSlug(fields.slug);

    const product = await Product.create(fields);
    return apiSuccess(JSON.parse(JSON.stringify(product)), 201);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return apiError("Unauthorized", 401);
    }
    return apiError("Failed to create product", 500);
  }
}
