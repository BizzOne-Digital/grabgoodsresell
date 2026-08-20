import { CartPageContent } from "@/app/cart/CartPageContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review your cart and proceed to checkout for local pickup.",
};

export default function CartPage() {
  return (
    <>
      <section className="border-b border-border bg-muted/30">
        <div className="container-page py-12 sm:py-16">
          <h1 className="font-display text-4xl font-semibold sm:text-5xl">
            Shopping Cart
          </h1>
          <p className="mt-3 text-muted-foreground">
            Review your items before checkout. All orders are for local pickup.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-page">
          <CartPageContent />
        </div>
      </section>
    </>
  );
}
