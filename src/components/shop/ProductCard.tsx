"use client";

import { Button } from "@/components/ui/Button";
import { useCart } from "@/contexts/CartContext";
import { cn, formatPrice, getEffectivePrice } from "@/lib/utils";
import type { Product } from "@/types";
import { ShoppingBag, Sparkles, Tag } from "lucide-react";
import Link from "next/link";

function ProductImage({
  src,
  alt,
  className,
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  if (!src) {
    return (
      <div
        className={cn(
          "flex h-full w-full items-center justify-center bg-muted text-muted-foreground",
          className,
        )}
      >
        <ShoppingBag className="h-8 w-8" />
      </div>
    );
  }

  const useNativeImg =
    src.startsWith("http") ||
    src.startsWith("/api/images/") ||
    src.includes("gridfs");

  if (useNativeImg) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} className={cn("h-full w-full object-cover", className)} />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={cn("h-full w-full object-cover", className)} />
  );
}

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { addItem } = useCart();

  const primaryImage = product.images[0];
  const imageUrl =
    product.thumbnail ||
    primaryImage?.url ||
    (primaryImage?.fileId ? `/api/images/${primaryImage.fileId}` : undefined);

  const effectivePrice = getEffectivePrice(product.price, product.salePrice);
  const onSale =
    product.salePrice != null &&
    product.salePrice > 0 &&
    product.salePrice < product.price;
  const inStock = product.quantity > 0;
  const isSold = product.status === "sold";

  const handleAddToCart = () => {
    if (!inStock || isSold) return;

    addItem({
      productId: product._id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      salePrice: product.salePrice ?? undefined,
      maxQuantity: product.quantity,
      image: imageUrl,
      condition: product.condition,
      pickupOnly: product.pickupOnly,
    });
  };

  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm card-hover",
        className,
      )}
    >
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-[4/3] overflow-hidden bg-muted"
      >
        <ProductImage
          src={imageUrl}
          alt={product.images[0]?.alt || product.name}
          className="transition duration-500 group-hover:scale-105"
        />

        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {product.isNew && (
            <span className="badge bg-primary text-primary-foreground">
              <Sparkles className="mr-1 h-3 w-3" />
              New
            </span>
          )}
          {(product.isSale || onSale) && (
            <span className="badge bg-accent text-white">
              <Tag className="mr-1 h-3 w-3" />
              Sale
            </span>
          )}
          {product.featured && (
            <span className="badge bg-warning/15 text-warning">Featured</span>
          )}
        </div>

        {!inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-foreground/50">
            <span className="rounded-full bg-card px-4 py-2 text-sm font-semibold text-foreground">
              Out of Stock
            </span>
          </div>
        )}

        {isSold && (
          <div className="absolute inset-0 flex items-center justify-center bg-foreground/50">
            <span className="rounded-full bg-card px-4 py-2 text-sm font-semibold text-foreground">
              Sold
            </span>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="badge bg-muted text-muted-foreground">
            {product.category}
          </span>
          <span className="badge border border-border bg-background text-foreground">
            {product.condition}
          </span>
        </div>

        <Link href={`/products/${product.slug}`} className="group/title">
          <h3 className="line-clamp-2 font-display text-lg font-semibold transition group-hover/title:text-primary">
            {product.name}
          </h3>
        </Link>

        {product.shortDescription && (
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
            {product.shortDescription}
          </p>
        )}

        <div className="mt-auto pt-4">
          <div className="mb-4 flex items-end gap-2">
            <span className="font-display text-xl font-semibold text-foreground">
              {formatPrice(effectivePrice)}
            </span>
            {onSale && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          <p
            className={cn(
              "mb-4 text-xs font-medium",
              inStock && !isSold ? "text-success" : "text-muted-foreground",
            )}
          >
            {isSold
              ? "No longer available"
              : inStock
                ? `${product.quantity} available`
                : "Currently unavailable"}
          </p>

          <div className="grid gap-2 sm:grid-cols-2">
            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={!inStock || isSold}
              className="w-full"
            >
              Add to Cart
            </Button>
            <Link href={`/products/${product.slug}`}>
              <Button variant="secondary" size="sm" className="w-full">
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
