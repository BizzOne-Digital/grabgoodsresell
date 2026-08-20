import { NextRequest } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/api-helpers";
import connectDB from "@/lib/db";
import PageContent from "@/models/PageContent";
import {
  defaultHomeContent,
  defaultAboutContent,
  defaultContactContent,
  defaultBookingContent,
  defaultPricingContent,
} from "@/lib/default-content";

const VALID_PAGES = ["home", "about", "contact", "booking", "pricing"] as const;

const DEFAULT_CONTENT: Record<(typeof VALID_PAGES)[number], object> = {
  home: defaultHomeContent,
  about: defaultAboutContent,
  contact: defaultContactContent,
  booking: defaultBookingContent,
  pricing: defaultPricingContent,
};

const contentUpdateSchema = z.object({
  content: z.record(z.string(), z.unknown()).optional(),
  draftContent: z.record(z.string(), z.unknown()).optional(),
  publish: z.boolean().optional(),
  seo: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
    })
    .optional(),
});

function isValidPage(page: string): page is (typeof VALID_PAGES)[number] {
  return VALID_PAGES.includes(page as (typeof VALID_PAGES)[number]);
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ page: string }> },
) {
  try {
    await requireAdminSession();
    const { page } = await params;

    if (!isValidPage(page)) {
      return apiError("Invalid page", 400);
    }

    await connectDB();

    let pageContent = await PageContent.findOne({ page }).lean();

    if (!pageContent) {
      pageContent = (
        await PageContent.create({
          page,
          content: DEFAULT_CONTENT[page],
          draftContent: DEFAULT_CONTENT[page],
          published: true,
        })
      ).toObject();
    }

    return apiSuccess(JSON.parse(JSON.stringify(pageContent)));
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return apiError("Unauthorized", 401);
    }
    return apiError("Failed to fetch page content", 500);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ page: string }> },
) {
  try {
    await requireAdminSession();
    const { page } = await params;

    if (!isValidPage(page)) {
      return apiError("Invalid page", 400);
    }

    const body = await request.json();
    const parsed = contentUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.issues[0]?.message || "Validation failed", 400);
    }

    await connectDB();

    const update: Record<string, unknown> = {};

    if (parsed.data.seo !== undefined) {
      update.seo = parsed.data.seo;
    }

    if (parsed.data.publish) {
      const publishedContent =
        parsed.data.draftContent ?? parsed.data.content ?? DEFAULT_CONTENT[page];

      update.content = publishedContent;
      update.draftContent = publishedContent;
      update.published = true;
    } else {
      if (parsed.data.draftContent !== undefined) {
        update.draftContent = parsed.data.draftContent;
      }
      if (parsed.data.content !== undefined) {
        update.content = parsed.data.content;
      }
    }

    const pageContent = await PageContent.findOneAndUpdate(
      { page },
      {
        $set: update,
        $setOnInsert: {
          page,
          content: DEFAULT_CONTENT[page],
          draftContent: DEFAULT_CONTENT[page],
          published: false,
        },
      },
      { returnDocument: "after", upsert: true, runValidators: true },
    ).lean();

    return apiSuccess(JSON.parse(JSON.stringify(pageContent)));
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return apiError("Unauthorized", 401);
    }
    return apiError("Failed to update page content", 500);
  }
}
