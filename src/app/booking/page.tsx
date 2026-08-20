import { getPageContent } from "@/lib/data";
import { defaultBookingContent } from "@/lib/default-content";
import { CalendarDays, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getPageContent("booking");
  const seo = pageData.seo as { title?: string; description?: string };

  return {
    title: seo?.title || "Book a Visit",
    description:
      seo?.description ||
      "Schedule a visit or pickup appointment with Grab My Goods Resell in Waxahachie, Texas.",
  };
}

export default async function BookingPage() {
  const pageData = await getPageContent("booking");
  const content = {
    ...defaultBookingContent,
    ...(pageData.content as typeof defaultBookingContent),
  };

  return (
    <>
      <section className="border-b border-border bg-gradient-to-br from-background via-card to-muted/40">
        <div className="container-page py-16 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Schedule
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">
            {content.hero.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            {content.hero.subtitle}
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-page">
          <div className="mx-auto max-w-3xl">
            <p className="text-lg leading-relaxed text-muted-foreground">
              {content.description}
            </p>

            {content.bookingType === "embed" && content.embedCode && (
              <div
                className="mt-10 overflow-hidden rounded-2xl border border-border bg-card"
                dangerouslySetInnerHTML={{ __html: content.embedCode }}
              />
            )}

            {content.bookingType === "url" && content.bookingUrl && (
              <div className="mt-10 rounded-2xl border border-border bg-card p-8 text-center">
                <CalendarDays className="mx-auto h-12 w-12 text-primary" />
                <h2 className="mt-4 font-display text-2xl font-semibold">
                  Book Online
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Use our scheduling tool to pick a time that works for you.
                </p>
                <a
                  href={content.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary mt-6 inline-flex"
                >
                  Open Booking Calendar
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            )}

            {(content.bookingType === "contact" || !content.bookingUrl) && (
              <div className="mt-10 rounded-2xl border border-border bg-muted/30 p-8">
                <h2 className="font-display text-xl font-semibold">
                  How to Schedule
                </h2>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  {content.instructions}
                </p>
                <div className="mt-6 flex flex-wrap gap-4">
                  <Link href="/contact" className="btn-primary">
                    Contact Us
                  </Link>
                  <Link href="/shop" className="btn-secondary">
                    Browse Inventory
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
