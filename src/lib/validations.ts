import { z } from "zod";
import { PRODUCT_CONDITIONS, PRODUCT_STATUSES, ORDER_STATUSES, PAYMENT_STATUSES } from "@/lib/constants";

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  slug: z.string().min(1).optional(),
  sku: z.string().optional(),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  price: z.number().min(0, "Price must be 0 or greater"),
  salePrice: z.number().min(0).optional().nullable(),
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().optional(),
  condition: z.enum(PRODUCT_CONDITIONS),
  quantity: z.number().int().min(0).default(1),
  images: z
    .array(
      z.object({
        url: z.string(),
        alt: z.string().optional(),
        fileId: z.string().optional(),
      }),
    )
    .default([]),
  thumbnail: z.string().optional(),
  status: z.enum(PRODUCT_STATUSES).default("draft"),
  featured: z.boolean().default(false),
  isNew: z.boolean().default(false),
  isSale: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  specifications: z.record(z.string(), z.string()).optional(),
  dimensions: z
    .object({
      width: z.string().optional(),
      height: z.string().optional(),
      depth: z.string().optional(),
      weight: z.string().optional(),
    })
    .optional(),
  pickupOnly: z.boolean().default(true),
  pickupInstructions: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

export const orderSchema = z.object({
  customer: z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Valid email is required"),
    phone: z.string().min(7, "Phone number is required"),
  }),
  items: z
    .array(
      z.object({
        productId: z.string(),
        name: z.string(),
        slug: z.string(),
        price: z.number(),
        salePrice: z.number().optional(),
        quantity: z.number().int().min(1),
        image: z.string().optional(),
        condition: z.string().optional(),
      }),
    )
    .min(1, "Order must have at least one item"),
  notes: z.string().optional(),
  pickupPreference: z.string().optional(),
});

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const loginSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

export const categorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  sortOrder: z.number().optional(),
  isActive: z.boolean().optional(),
});

export const testimonialSchema = z.object({
  customerName: z.string().min(1),
  testimonial: z.string().min(1),
  rating: z.number().min(1).max(5).default(5),
  date: z.string().or(z.date()).optional(),
  image: z.string().optional(),
  published: z.boolean().default(true),
  featured: z.boolean().default(false),
  sortOrder: z.number().optional(),
});

export const faqSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
  published: z.boolean().default(true),
  sortOrder: z.number().optional(),
});

export const orderStatusSchema = z.object({
  status: z.enum(ORDER_STATUSES),
  paymentStatus: z.enum(PAYMENT_STATUSES).optional(),
});

export const siteSettingsSchema = z.object({
  businessName: z.string().min(1),
  tagline: z.string().optional(),
  logo: z.string().optional(),
  favicon: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  socialLinks: z.array(z.object({ label: z.string(), url: z.string() })).optional(),
  businessDescription: z.string().optional(),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
  accentColor: z.string().optional(),
  announcementBar: z
    .object({
      enabled: z.boolean(),
      text: z.string(),
      link: z.string().optional(),
    })
    .optional(),
  footerText: z.string().optional(),
  copyright: z.string().optional(),
  pickupInfo: z.string().optional(),
  businessHours: z.string().optional(),
  seo: z
    .object({
      title: z.string(),
      description: z.string(),
    })
    .optional(),
});

export type ProductInput = z.infer<typeof productSchema>;
export type OrderInput = z.infer<typeof orderSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
