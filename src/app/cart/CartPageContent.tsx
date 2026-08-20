"use client";

import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { useCart } from "@/contexts/CartContext";
import { formatPrice, getEffectivePrice } from "@/lib/utils";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";

function CartItemImage({ src, alt }: { src?: string; alt: string }) {
  if (!src) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
        <ShoppingBag className="h-6 w-6" />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className="h-full w-full object-cover" />
  );
}

export function CartPageContent() {
  const { items, subtotal, removeItem, updateQuantity, clearCart, isHydrated } =
    useCart();
  const displayItems = isHydrated ? items : [];
  const displaySubtotal = isHydrated ? subtotal : 0;

  if (displayItems.length === 0) {
    return (
      <EmptyState
        icon="cart"
        title="Your cart is empty"
        description="Browse our shop and add items you'd like to pick up locally."
        action={
          <Link href="/shop">
            <Button size="lg">Browse Shop</Button>
          </Link>
        }
      />
    );
  }

  const itemCount = displayItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
          </p>
          <button
            type="button"
            onClick={clearCart}
            className="text-sm font-medium text-danger transition hover:underline"
          >
            Clear cart
          </button>
        </div>

        <ul className="space-y-4">
          {displayItems.map((item) => {
            const unitPrice = getEffectivePrice(item.price, item.salePrice);
            const lineTotal = unitPrice * item.quantity;

            return (
              <li
                key={item.productId}
                className="flex gap-4 rounded-2xl border border-border bg-card p-4 sm:p-5"
              >
                <Link
                  href={`/products/${item.slug}`}
                  className="h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-border bg-muted sm:h-28 sm:w-28"
                >
                  <CartItemImage src={item.image} alt={item.name} />
                </Link>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link
                        href={`/products/${item.slug}`}
                        className="font-display text-lg font-semibold transition hover:text-primary"
                      >
                        {item.name}
                      </Link>
                      {item.condition && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {item.condition}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      className="rounded-full p-2 text-muted-foreground transition hover:bg-muted hover:text-danger"
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="inline-flex items-center rounded-full border border-border bg-background">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1)
                        }
                        className="inline-flex h-9 w-9 items-center justify-center rounded-l-full transition hover:bg-muted"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="min-w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1)
                        }
                        disabled={item.quantity >= item.maxQuantity}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-r-full transition hover:bg-muted disabled:opacity-40"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="font-display text-lg font-semibold">
                        {formatPrice(lineTotal)}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-muted-foreground">
                          {formatPrice(unitPrice)} each
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <aside className="h-fit rounded-2xl border border-border bg-card p-6 sm:p-8 lg:sticky lg:top-24">
        <h2 className="font-display text-2xl font-semibold">Order Summary</h2>

        <div className="mt-6 space-y-3 border-b border-border pb-6">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatPrice(displaySubtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Pickup</span>
            <span className="font-medium text-success">Free</span>
          </div>
        </div>

        <div className="mt-4 flex justify-between">
          <span className="font-display text-lg font-semibold">Total</span>
          <span className="font-display text-xl font-semibold">
            {formatPrice(displaySubtotal)}
          </span>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          Local pickup only in Waxahachie, Texas. Payment and pickup details
          confirmed after order placement.
        </p>

        <div className="mt-6 grid gap-3">
          <Link href="/checkout">
            <Button size="lg" className="w-full">
              Proceed to Checkout
            </Button>
          </Link>
          <Link href="/shop">
            <Button variant="secondary" size="lg" className="w-full">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </aside>
    </div>
  );
}
