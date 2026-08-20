import { getSiteSettings } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of service for Grab My Goods Resell.",
};

export default async function TermsPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <section className="border-b border-border bg-muted/30">
        <div className="container-page py-12 sm:py-16">
          <h1 className="font-display text-4xl font-semibold sm:text-5xl">
            Terms of Service
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Last updated: August 2026
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-page">
          <div className="prose prose-sm mx-auto max-w-3xl text-muted-foreground">
            <p className="text-base leading-relaxed">
              Welcome to {settings.businessName}. By using our website and placing orders,
              you agree to the following terms. Please read them carefully.
            </p>

            <h2 className="mt-10 font-display text-xl font-semibold text-foreground">
              Orders & Availability
            </h2>
            <p className="mt-4 leading-relaxed">
              Submitting an order is a request to purchase items. We will confirm
              availability before finalizing your order. Items are sold on a first-come,
              first-served basis once confirmed.
            </p>

            <h2 className="mt-10 font-display text-xl font-semibold text-foreground">
              Local Pickup
            </h2>
            <p className="mt-4 leading-relaxed">
              All sales are for local pickup in the Waxahachie, Texas area unless otherwise
              stated. Pickup location and scheduling details are provided after order
              confirmation. {settings.pickupInfo}
            </p>

            <h2 className="mt-10 font-display text-xl font-semibold text-foreground">
              Item Condition
            </h2>
            <p className="mt-4 leading-relaxed">
              Most items are pre-owned resale finds. Condition is described in each listing.
              Please review photos and descriptions carefully and contact us with questions
              before purchasing.
            </p>

            <h2 className="mt-10 font-display text-xl font-semibold text-foreground">
              Pricing & Payment
            </h2>
            <p className="mt-4 leading-relaxed">
              Prices are listed in US dollars. Payment arrangements are confirmed after
              your order is accepted. We reserve the right to correct pricing errors.
            </p>

            <h2 className="mt-10 font-display text-xl font-semibold text-foreground">
              Returns
            </h2>
            <p className="mt-4 leading-relaxed">
              Return policies may vary by item. Contact us before purchasing if you have
              concerns. We aim to resolve issues fairly and promptly.
            </p>

            <h2 className="mt-10 font-display text-xl font-semibold text-foreground">
              Contact
            </h2>
            <p className="mt-4 leading-relaxed">
              For questions about these terms, contact us at{" "}
              <a
                href={`mailto:${settings.email}`}
                className="text-primary transition hover:underline"
              >
                {settings.email}
              </a>{" "}
              or {settings.phone}.
            </p>

            <p className="mt-10 rounded-2xl border border-border bg-muted/30 p-5 text-sm">
              This is a placeholder terms of service document and should be reviewed and
              updated with legal counsel before production use.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
