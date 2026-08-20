"use client";

import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { useCart } from "@/contexts/CartContext";
import { cn, formatPrice, getEffectivePrice } from "@/lib/utils";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

function CartItemImage({ src, alt }: { src?: string; alt: string }) {
  if (!src) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
        <ShoppingBag className="h-5 w-5" />
      </div>
    );
  }

  const isDynamic =
    src.startsWith("http") ||
    src.startsWith("/api/images/") ||
    src.includes("gridfs");

  if (isDynamic) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} className="h-full w-full object-cover" />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className="h-full w-full object-cover" />
  );
}

export function CartDrawer() {
  const {
    items,
    itemCount,
    subtotal,
    isOpen,
    isHydrated,
    closeCart,
    removeItem,
    updateQuantity,
  } = useCart();

  const displayCount = isHydrated ? itemCount : 0;
  const displayItems = isHydrated ? items : [];
  const displaySubtotal = isHydrated ? subtotal : 0;

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeCart();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
    }

    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, closeCart]);

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-50 bg-foreground/30 transition-opacity duration-300",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden={!isOpen}
        onClick={closeCart}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-border bg-card shadow-2xl transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="font-display text-lg font-semibold">Your Cart</h2>
            <p className="text-sm text-muted-foreground">
              {displayCount} {displayCount === 1 ? "item" : "items"}
            </p>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {displayItems.length === 0 ? (
            <EmptyState
              icon="cart"
              title="Your cart is empty"
              description="Browse our shop and add items you'd like to pick up locally."
              action={
                <Link href="/shop" onClick={closeCart}>
                  <Button variant="secondary">Continue Shopping</Button>
                </Link>
              }
              className="py-10"
            />
          ) : (
            <ul className="space-y-4">
              {displayItems.map((item) => {
                const unitPrice = getEffectivePrice(item.price, item.salePrice);
                const lineTotal = unitPrice * item.quantity;

                return (
                  <li
                    key={item.productId}
                    className="flex gap-4 rounded-2xl border border-border bg-background p-3"
                  >
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
                      <CartItemImage
                        src={item.image}
                        alt={item.name}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <Link
                            href={`/products/${item.slug}`}
                            onClick={closeCart}
                            className="line-clamp-2 text-sm font-semibold transition hover:text-primary"
                          >
                            {item.name}
                          </Link>
                          {item.condition && (
                            <p className="mt-1 text-xs text-muted-foreground">
                              {item.condition}
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.productId)}
                          className="shrink-0 rounded-full p-1 text-muted-foreground transition hover:bg-muted hover:text-danger focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-3">
                        <div className="inline-flex items-center rounded-full border border-border bg-card">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity - 1)
                            }
                            className="inline-flex h-8 w-8 items-center justify-center rounded-l-full transition hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                            aria-label={`Decrease quantity of ${item.name}`}
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
                            className="inline-flex h-8 w-8 items-center justify-center rounded-r-full transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                            aria-label={`Increase quantity of ${item.name}`}
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-semibold">
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
          )}
        </div>

        {displayItems.length > 0 && (
          <div className="border-t border-border px-5 py-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Subtotal</span>
              <span className="font-display text-xl font-semibold">
                {formatPrice(displaySubtotal)}
              </span>
            </div>
            <p className="mb-4 text-xs text-muted-foreground">
              Local pickup only. Final details shared after order confirmation.
            </p>
            <div className="grid gap-3">
              <Link href="/checkout" onClick={closeCart}>
                <Button className="w-full" size="lg">
                  Proceed to Checkout
                </Button>
              </Link>
              <Button variant="secondary" className="w-full" onClick={closeCart}>
                Continue Shopping
              </Button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
