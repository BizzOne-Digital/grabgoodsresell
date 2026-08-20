import { getPageContent } from "@/lib/data";
import { defaultPricingContent } from "@/lib/default-content";
import { Check } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getPageContent("pricing");
  const seo = pageData.seo as { title?: string; description?: string };

  return {
    title: seo?.title || "Pricing",
    description:
      seo?.description ||
      "Fair, individually researched pricing on every item — plus in-person sale events in Waxahachie, Texas.",
  };
}

export default async function PricingPage() {
  const pageData = await getPageContent("pricing");
  const content = {
    ...defaultPricingContent,
    ...(pageData.content as typeof defaultPricingContent),
  };

  return (
    <>
      <section className="border-b border-border bg-gradient-to-br from-background via-card to-muted/40">
        <div className="container-page py-16 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Pricing
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
          <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
            {content.intro}
          </p>

          <div className="grid gap-6 lg:grid-cols-3">
            {content.cards.map((card) => (
              <div
                key={card.title}
                className={`relative flex flex-col rounded-2xl border bg-card p-8 ${
                  card.featured
                    ? "border-primary shadow-lg ring-2 ring-primary/15 lg:-translate-y-2"
                    : "border-border"
                }`}
              >
                {card.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
                    Most Popular
                  </span>
                )}

                <h2 className="font-display text-xl font-semibold">{card.title}</h2>
                <p className="mt-2 font-display text-2xl font-semibold text-primary">
                  {card.price}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {card.description}
                </p>

                <ul className="mt-6 flex-1 space-y-3">
                  {card.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm text-muted-foreground"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {card.cta.href.startsWith("http") ? (
                  <a
                    href={card.cta.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={card.featured ? "btn-primary mt-8 inline-flex" : "btn-secondary mt-8 inline-flex"}
                  >
                    {card.cta.label}
                  </a>
                ) : (
                  <Link
                    href={card.cta.href}
                    className={card.featured ? "btn-primary mt-8" : "btn-secondary mt-8"}
                  >
                    {card.cta.label}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
