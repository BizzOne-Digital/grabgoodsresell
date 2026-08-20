import { CheckoutPageContent } from "@/app/checkout/CheckoutPageContent";
import { getSiteSettings } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your order for local pickup at Grab My Goods Resell.",
};

export default async function CheckoutPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <section className="border-b border-border bg-muted/30">
        <div className="container-page py-12 sm:py-16">
          <h1 className="font-display text-4xl font-semibold sm:text-5xl">
            Checkout
          </h1>
          <p className="mt-3 text-muted-foreground">
            Enter your contact details to place your order. We&apos;ll confirm
            availability and arrange local pickup.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-page">
          <CheckoutPageContent pickupInfo={settings.pickupInfo} />
        </div>
      </section>
    </>
  );
}
