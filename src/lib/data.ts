import connectDB from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";
import PageContent from "@/models/PageContent";
import Category from "@/models/Category";
import Testimonial from "@/models/Testimonial";
import FAQ from "@/models/FAQ";
import Product from "@/models/Product";
import type { SiteSettingsData } from "@/types";
import { BUSINESS_INFO, DEFAULT_CATEGORIES } from "@/lib/constants";
import { slugifyText } from "@/lib/utils";
import { defaultHomeContent, defaultAboutContent, defaultContactContent, defaultBookingContent, defaultPricingContent } from "@/lib/default-content";

function serialize<T>(doc: T): T {
  return JSON.parse(JSON.stringify(doc));
}

export async function getSiteSettings(): Promise<SiteSettingsData> {
  try {
    await connectDB();
    let settings = await SiteSettings.findOne().lean();

    if (!settings) {
      settings = await SiteSettings.create({});
    }

    return serialize(settings) as SiteSettingsData;
  } catch {
    return {
      businessName: BUSINESS_INFO.name,
      tagline: BUSINESS_INFO.tagline,
      phone: BUSINESS_INFO.phone,
      email: BUSINESS_INFO.email,
      facebook: BUSINESS_INFO.facebook,
      socialLinks: [],
      businessDescription: "",
      primaryColor: "#C45C3E",
      secondaryColor: "#D4C4B0",
      accentColor: "#2D2A26",
      announcementBar: {
        enabled: true,
        text: "New finds added regularly — browse our full inventory online!",
        link: "/shop",
      },
      footerText:
        "Local pickup in Waxahachie, Texas. Fair prices, friendly service, and constantly changing inventory.",
      copyright: "© Grab My Goods Resell. All rights reserved.",
      pickupInfo:
        "Local pickup only. Pickup details will be shared after your order is confirmed.",
      businessHours: "By appointment — contact us to schedule pickup.",
      seo: {
        title: "Grab My Goods Resell | Local Resale Finds in Waxahachie, TX",
        description:
          "Browse unique resale finds from Grab My Goods Resell. Vintage, household goods, collectibles, and more.",
      },
    };
  }
}

export async function getPageContent(page: string) {
  const defaults: Record<string, object> = {
    home: defaultHomeContent,
    about: defaultAboutContent,
    contact: defaultContactContent,
    booking: defaultBookingContent,
    pricing: defaultPricingContent,
  };

  try {
    await connectDB();
    let content = await PageContent.findOne({
      page: page as "home" | "about" | "contact" | "booking" | "pricing",
      published: true,
    }).lean();

    if (!content) {
      content = await PageContent.findOneAndUpdate(
        { page: page as "home" | "about" | "contact" | "booking" | "pricing" },
        {
          page: page as "home" | "about" | "contact" | "booking" | "pricing",
          content: defaults[page] ?? {},
          published: true,
        },
        { upsert: true, returnDocument: "after" },
      ).lean();
    }

    return serialize(content);
  } catch {
    return {
      page,
      content: defaults[page] ?? {},
      seo: {},
    };
  }
}

export async function getCategories() {
  try {
    await connectDB();
    let categories = await Category.find({ isActive: true })
      .sort({ sortOrder: 1, name: 1 })
      .lean();

    if (categories.length === 0) {
      await Category.insertMany(
        DEFAULT_CATEGORIES.map((name, index) => ({
          name,
          slug: slugifyText(name),
          sortOrder: index,
        })),
      );
      categories = await Category.find({ isActive: true })
        .sort({ sortOrder: 1, name: 1 })
        .lean();
    }

    return serialize(categories);
  } catch {
    return DEFAULT_CATEGORIES.map((name, index) => ({
      name,
      slug: slugifyText(name),
      sortOrder: index,
    }));
  }
}

export async function getFeaturedProducts(limit = 8) {
  try {
    await connectDB();
    const products = await Product.find({ status: "active", featured: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    return serialize(products);
  } catch {
    return [];
  }
}

export async function getPublishedTestimonials(limit?: number) {
  try {
    await connectDB();
    const query = Testimonial.find({ published: true }).sort({
      featured: -1,
      sortOrder: 1,
      createdAt: -1,
    });
    if (limit) query.limit(limit);
    return serialize(await query.lean());
  } catch {
    return [];
  }
}

export async function getPublishedFAQs(limit?: number) {
  try {
    await connectDB();
    const query = FAQ.find({ published: true }).sort({ sortOrder: 1 });
    if (limit) query.limit(limit);
    return serialize(await query.lean());
  } catch {
    return [];
  }
}

export async function getProductBySlug(slug: string) {
  await connectDB();
  const product = await Product.findOne({ slug, status: "active" }).lean();
  return product ? serialize(product) : null;
}

export async function getRelatedProducts(category: string, excludeId: string, limit = 4) {
  await connectDB();
  const products = await Product.find({
    status: "active",
    category,
    _id: { $ne: excludeId },
  })
    .sort({ featured: -1, createdAt: -1 })
    .limit(limit)
    .lean();
  return serialize(products);
}

export async function getAdminStats() {
  await connectDB();
  const [
    totalProducts,
    activeProducts,
    soldProducts,
    hiddenProducts,
    totalOrders,
    pendingOrders,
    recentProducts,
    recentOrders,
  ] = await Promise.all([
    Product.countDocuments(),
    Product.countDocuments({ status: "active" }),
    Product.countDocuments({ status: "sold" }),
    Product.countDocuments({ status: "hidden" }),
    (await import("@/models/Order")).default.countDocuments(),
    (await import("@/models/Order")).default.countDocuments({ status: "pending" }),
    Product.find().sort({ createdAt: -1 }).limit(5).lean(),
    (await import("@/models/Order")).default.find().sort({ createdAt: -1 }).limit(5).lean(),
  ]);

  return {
    totalProducts,
    activeProducts,
    soldProducts,
    hiddenProducts,
    totalOrders,
    pendingOrders,
    recentProducts: serialize(recentProducts),
    recentOrders: serialize(recentOrders),
  };
}
