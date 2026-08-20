import { FAQAccordion } from "@/components/content/FAQAccordion";
import { getPublishedFAQs } from "@/lib/data";
import { defaultFAQs } from "@/lib/default-content";
import type { FAQItem } from "@/types";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about shopping, pickup, and ordering from Grab My Goods Resell.",
};

export default async function FAQPage() {
  const faqs = await getPublishedFAQs();

  const displayFaqs = (
    faqs.length > 0
      ? faqs
      : defaultFAQs.map((item, index) => ({
          ...item,
          _id: `default-faq-${index}`,
        }))
  ) as FAQItem[];

  return (
    <>
      <section className="border-b border-border bg-gradient-to-br from-background via-card to-muted/40">
        <div className="container-page py-16 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Help Center
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Everything you need to know about browsing our inventory, placing orders,
            and picking up your finds locally in Waxahachie, Texas.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-page">
          <div className="mx-auto max-w-3xl">
            <FAQAccordion items={displayFaqs} allowMultiple />
          </div>

          <div className="mx-auto mt-16 max-w-2xl rounded-3xl border border-border bg-card px-8 py-10 text-center">
            <h2 className="font-display text-2xl font-semibold">
              Still Have Questions?
            </h2>
            <p className="mt-3 text-muted-foreground">
              We&apos;re happy to help — reach out anytime about a specific item or
              pickup scheduling.
            </p>
            <Link href="/contact" className="btn-primary mt-6 inline-flex">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
