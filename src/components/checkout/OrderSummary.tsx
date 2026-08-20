import { cn, formatPrice, getEffectivePrice } from "@/lib/utils";
import type { CartItem } from "@/types";
import { ShoppingBag } from "lucide-react";

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  className?: string;
  showPickupNote?: boolean;
}

function SummaryItemImage({ src, alt }: { src?: string; alt: string }) {
  if (!src) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
        <ShoppingBag className="h-4 w-4" />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className="h-full w-full object-cover" />
  );
}

export function OrderSummary({
  items,
  subtotal,
  className,
  showPickupNote = true,
}: OrderSummaryProps) {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <aside
      className={cn(
        "rounded-2xl border border-border bg-card p-6 sm:p-8",
        className,
      )}
      aria-label="Order summary"
    >
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="font-display text-2xl font-semibold">Order Summary</h2>
        <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          {itemCount} {itemCount === 1 ? "item" : "items"}
        </span>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Your cart is empty. Add items from the shop to continue.
        </p>
      ) : (
        <>
          <ul className="space-y-4">
            {items.map((item) => {
              const unitPrice = getEffectivePrice(item.price, item.salePrice);
              const lineTotal = unitPrice * item.quantity;

              return (
                <li
                  key={item.productId}
                  className="flex gap-3 border-b border-border pb-4 last:border-b-0 last:pb-0"
                >
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
                    <SummaryItemImage src={item.image} alt={item.name} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-semibold">
                      {item.name}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span>Qty {item.quantity}</span>
                      {item.condition && <span>• {item.condition}</span>}
                    </div>
                    <p className="mt-2 text-sm font-medium">
                      {formatPrice(lineTotal)}
                    </p>
                    {item.quantity > 1 && (
                      <p className="text-xs text-muted-foreground">
                        {formatPrice(unitPrice)} each
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 space-y-3 border-t border-border pt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Pickup</span>
              <span className="font-medium text-success">Free</span>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-3">
              <span className="font-display text-lg font-semibold">Total</span>
              <span className="font-display text-xl font-semibold">
                {formatPrice(subtotal)}
              </span>
            </div>
          </div>

          {showPickupNote && (
            <p className="mt-5 rounded-2xl bg-background p-4 text-xs leading-relaxed text-muted-foreground">
              All orders are for local pickup in Waxahachie, Texas. Payment and
              pickup details will be confirmed after you place your order.
            </p>
          )}
        </>
      )}
    </aside>
  );
}
