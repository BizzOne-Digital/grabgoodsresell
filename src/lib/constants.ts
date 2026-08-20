export const PRODUCT_CONDITIONS = [
  "New",
  "Like New",
  "Good",
  "Fair",
  "Used",
  "Vintage",
  "Other",
] as const;

export const PRODUCT_STATUSES = [
  "draft",
  "active",
  "sold",
  "hidden",
  "archived",
] as const;

export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "ready_for_pickup",
  "completed",
  "cancelled",
] as const;

export const PAYMENT_STATUSES = [
  "unpaid",
  "pending",
  "paid",
  "failed",
  "refunded",
] as const;

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "name_asc", label: "Name: A to Z" },
  { value: "featured", label: "Featured" },
] as const;

export const DEFAULT_CATEGORIES = [
  "Furniture",
  "Electronics",
  "Home & Kitchen",
  "Tools",
  "Clothing",
  "Collectibles",
  "Toys & Games",
  "Decor",
  "Appliances",
  "Miscellaneous",
] as const;

export const BUSINESS_INFO = {
  name: "Grab My Goods Resell",
  phone: "+1 817-715-7028",
  email: "grabmygoodsresell@gmail.com",
  facebook: "https://www.facebook.com/61579309705671/",
  location: "Waxahachie, Texas",
  tagline: "Hidden gems. Great finds. Ready for a new home.",
};
