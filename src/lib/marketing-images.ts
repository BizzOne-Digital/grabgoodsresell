export const MARKETING_IMAGES = {
  hero: "/images/marketing/hero.png",
  shopBanner: "/images/marketing/shop-banner.png",
  aboutStory: "/images/marketing/about-story.png",
} as const;

export const CATEGORY_IMAGES: Record<string, string> = {
  Furniture: "/images/categories/category-furniture.png",
  Electronics: "/images/categories/category-electronics.png",
  "Home & Kitchen": "/images/categories/category-home-kitchen.png",
  Collectibles: "/images/categories/category-collectibles.png",
  Decor: "/images/products/product-decor-vase.png",
  Tools: "/images/products/product-tool-set.png",
  "Toys & Games": "/images/products/product-vintage-toy.png",
  Clothing: "/images/marketing/hero.png",
  Appliances: "/images/products/product-kitchen-mixer.png",
  Miscellaneous: "/images/products/product-collectibles.png",
};

export function getCategoryImage(categoryName: string) {
  return CATEGORY_IMAGES[categoryName] ?? MARKETING_IMAGES.hero;
}
