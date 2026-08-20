"use client";

import { Button } from "@/components/ui/Button";
import { useCart } from "@/contexts/CartContext";
import { cn, formatPrice, getEffectivePrice } from "@/lib/utils";
import type { Product } from "@/types";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useState } from "react";

interface ProductActionsProps {
  product: Product;
  imageUrl?: string;
}

export function ProductActions({ product, imageUrl }: ProductActionsProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

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
      quantity,
      maxQuantity: product.quantity,
      image: imageUrl,
      condition: product.condition,
      pickupOnly: product.pickupOnly,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-3">
        <span className="font-display text-3xl font-semibold sm:text-4xl">
          {formatPrice(effectivePrice)}
        </span>
        {onSale && (
          <span className="text-lg text-muted-foreground line-through">
            {formatPrice(product.price)}
          </span>
        )}
      </div>

      <p
        className={cn(
          "text-sm font-medium",
          inStock && !isSold ? "text-success" : "text-muted-foreground",
        )}
      >
        {isSold
          ? "This item has been sold"
          : inStock
            ? `${product.quantity} available for pickup`
            : "Currently out of stock"}
      </p>

      {inStock && !isSold && (
        <div className="flex flex-wrap items-center gap-4">
          <div className="inline-flex items-center rounded-full border border-border bg-card">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="inline-flex h-11 w-11 items-center justify-center rounded-l-full transition hover:bg-muted"
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="min-w-10 text-center font-medium">{quantity}</span>
            <button
              type="button"
              onClick={() =>
                setQuantity((q) => Math.min(product.quantity, q + 1))
              }
              disabled={quantity >= product.quantity}
              className="inline-flex h-11 w-11 items-center justify-center rounded-r-full transition hover:bg-muted disabled:opacity-40"
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <Button size="lg" onClick={handleAddToCart} className="flex-1 sm:flex-none">
            <ShoppingBag className="h-5 w-5" />
            Add to Cart
          </Button>
        </div>
      )}

      {product.pickupOnly !== false && (
        <div className="rounded-2xl border border-border bg-muted/30 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            Local Pickup Only
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            This item is available for local pickup in the Waxahachie, Texas area.
            Pickup details are shared after your order is confirmed.
          </p>
        </div>
      )}
    </div>
  );
}
