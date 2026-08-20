import { NextRequest, NextResponse } from "next/server";
import Product from "@/models/Product";
import connectDB from "@/lib/db";

export interface ProductQueryParams {
  q?: string;
  category?: string;
  condition?: string;
  minPrice?: string;
  maxPrice?: string;
  availability?: string;
  featured?: string;
  isNew?: string;
  isSale?: string;
  sort?: string;
  page?: string;
  limit?: string;
  status?: string;
}

export async function queryProducts(params: ProductQueryParams, admin = false) {
  await connectDB();

  const page = Math.max(1, parseInt(params.page || "1", 10));
  const limit = Math.min(48, Math.max(1, parseInt(params.limit || "12", 10)));
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = {};

  if (admin && params.status) {
    filter.status = params.status;
  } else if (admin) {
    filter.status = { $ne: "archived" };
  } else {
    filter.status = "active";
  }

  if (params.q) {
    filter.$text = { $search: params.q };
  }

  if (params.category) {
    filter.category = params.category;
  }

  if (params.condition) {
    filter.condition = params.condition;
  }

  if (params.featured === "true") {
    filter.featured = true;
  }

  if (params.isNew === "true") {
    filter.isNew = true;
  }

  if (params.isSale === "true") {
    filter.isSale = true;
  }

  if (params.availability === "in_stock") {
    filter.quantity = { $gt: 0 };
  } else if (params.availability === "out_of_stock") {
    filter.quantity = { $lte: 0 };
  }

  const minPrice = params.minPrice ? parseFloat(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? parseFloat(params.maxPrice) : undefined;

  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined) (filter.price as Record<string, number>).$gte = minPrice;
    if (maxPrice !== undefined) (filter.price as Record<string, number>).$lte = maxPrice;
  }

  let sort: Record<string, 1 | -1> = { createdAt: -1 };

  switch (params.sort) {
    case "oldest":
      sort = { createdAt: 1 };
      break;
    case "price_asc":
      sort = { price: 1 };
      break;
    case "price_desc":
      sort = { price: -1 };
      break;
    case "name_asc":
      sort = { name: 1 };
      break;
    case "featured":
      sort = { featured: -1, createdAt: -1 };
      break;
    default:
      sort = { createdAt: -1 };
  }

  const [products, total] = await Promise.all([
    Product.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Product.countDocuments(filter),
  ]);

  return {
    products: JSON.parse(JSON.stringify(products)),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    },
  };
}

export function getQueryParams(request: NextRequest): ProductQueryParams {
  const { searchParams } = new URL(request.url);
  return {
    q: searchParams.get("q") || undefined,
    category: searchParams.get("category") || undefined,
    condition: searchParams.get("condition") || undefined,
    minPrice: searchParams.get("minPrice") || undefined,
    maxPrice: searchParams.get("maxPrice") || undefined,
    availability: searchParams.get("availability") || undefined,
    featured: searchParams.get("featured") || undefined,
    isNew: searchParams.get("isNew") || undefined,
    isSale: searchParams.get("isSale") || undefined,
    sort: searchParams.get("sort") || undefined,
    page: searchParams.get("page") || undefined,
    limit: searchParams.get("limit") || undefined,
    status: searchParams.get("status") || undefined,
  };
}

export function apiError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}
