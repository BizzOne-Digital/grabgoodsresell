export type ProductCondition =
  | "New"
  | "Like New"
  | "Good"
  | "Fair"
  | "Used"
  | "Vintage"
  | "Other";

export type ProductStatus =
  | "draft"
  | "active"
  | "sold"
  | "hidden"
  | "archived";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "ready_for_pickup"
  | "completed"
  | "cancelled";

export type PaymentStatus =
  | "unpaid"
  | "pending"
  | "paid"
  | "failed"
  | "refunded";

export interface ProductImage {
  url: string;
  alt?: string;
  fileId?: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  sku?: string;
  description?: string;
  shortDescription?: string;
  price: number;
  salePrice?: number | null;
  category: string;
  subcategory?: string;
  condition: ProductCondition;
  quantity: number;
  images: ProductImage[];
  thumbnail?: string;
  status: ProductStatus;
  featured?: boolean;
  isNew?: boolean;
  isSale?: boolean;
  tags?: string[];
  pickupOnly?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface FAQItem {
  _id: string;
  question: string;
  answer: string;
}

export interface TestimonialItem {
  _id: string;
  customerName: string;
  testimonial: string;
  rating: number;
  date?: string;
  image?: string;
  featured?: boolean;
}

export interface CheckoutFormData {
  name: string;
  email: string;
  phone: string;
  notes: string;
  pickupPreference: string;
}

export interface ProductFilterState {
  q: string;
  category: string;
  condition: string;
  minPrice: string;
  maxPrice: string;
  availability: string;
  featured: boolean;
  isNew: boolean;
  isSale: boolean;
  sort: string;
}

export interface ProductDimensions {
  width?: string;
  height?: string;
  depth?: string;
  weight?: string;
}

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  salePrice?: number;
  quantity: number;
  maxQuantity: number;
  image?: string;
  condition?: string;
  pickupOnly?: boolean;
}

export interface SiteSettingsData {
  businessName: string;
  tagline: string;
  logo?: string;
  favicon?: string;
  phone: string;
  email: string;
  facebook?: string;
  instagram?: string;
  socialLinks: { label: string; url: string }[];
  businessDescription: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  announcementBar: {
    enabled: boolean;
    text: string;
    link?: string;
  };
  footerText: string;
  copyright: string;
  pickupInfo: string;
  businessHours: string;
  seo: {
    title: string;
    description: string;
  };
}

export interface HeroContent {
  title: string;
  subtitle: string;
  description: string;
  primaryButton: { label: string; href: string };
  secondaryButton: { label: string; href: string };
  image?: string;
}

export interface HowItWorksStep {
  title: string;
  description: string;
  icon?: string;
}

export interface PricingCard {
  title: string;
  price: string;
  description: string;
  features: string[];
  cta: { label: string; href: string };
  featured?: boolean;
}

export interface PageSeo {
  title?: string;
  description?: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

export interface PaymentProvider {
  name: string;
  processPayment: (amount: number, metadata: Record<string, unknown>) => Promise<PaymentResult>;
  refundPayment: (transactionId: string) => Promise<PaymentResult>;
}
