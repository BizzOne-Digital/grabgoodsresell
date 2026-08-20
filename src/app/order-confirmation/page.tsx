import { getSiteSettings } from "@/lib/data";
import { CheckCircle2, Mail, Phone } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Order Confirmation",
  description: "Your order has been placed successfully.",
};

interface OrderConfirmationPageProps {
  searchParams: Promise<{ order?: string }>;
}

export default async function OrderConfirmationPage({
  searchParams,
}: OrderConfirmationPageProps) {
  const { order: orderNumber } = await searchParams;
  const settings = await getSiteSettings();

  return (
    <section className="section-padding">
      <div className="container-page">
        <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-card px-8 py-14 text-center sm:px-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
            <CheckCircle2 className="h-9 w-9 text-success" />
          </div>

          <h1 className="mt-6 font-display text-3xl font-semibold sm:text-4xl">
            Order Placed Successfully!
          </h1>

          <p className="mt-4 text-muted-foreground">
            Thank you for your order. We&apos;ll review your request and contact
            you shortly to confirm availability and arrange local pickup.
          </p>

          {orderNumber && (
            <div className="mt-8 rounded-2xl border border-border bg-muted/30 px-6 py-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                Order Number
              </p>
              <p className="mt-2 font-display text-2xl font-semibold tracking-wide">
                {orderNumber}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Please save this number for your records.
              </p>
            </div>
          )}

          <div className="mt-8 rounded-2xl border border-border bg-background p-5 text-left">
            <p className="text-sm font-semibold">What happens next?</p>
            <ol className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>1. We&apos;ll confirm item availability</li>
              <li>2. We&apos;ll reach out to schedule your pickup time</li>
              <li>3. Pick up your items locally in Waxahachie, Texas</li>
            </ol>
          </div>

          <div className="mt-8 flex flex-col items-center gap-3 text-sm text-muted-foreground">
            <p>Questions about your order?</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href={`tel:${settings.phone.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-2 transition hover:text-primary"
              >
                <Phone className="h-4 w-4" />
                {settings.phone}
              </a>
              <a
                href={`mailto:${settings.email}`}
                className="inline-flex items-center gap-2 transition hover:text-primary"
              >
                <Mail className="h-4 w-4" />
                {settings.email}
              </a>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/shop" className="btn-primary">
              Continue Shopping
            </Link>
            <Link href="/contact" className="btn-secondary">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
