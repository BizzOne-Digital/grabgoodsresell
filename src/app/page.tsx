import { FAQAccordion } from "@/components/content/FAQAccordion";
import { TestimonialCard } from "@/components/content/TestimonialCard";
import { ProductGrid } from "@/components/shop/ProductGrid";
import {
  getCategories,
  getFeaturedProducts,
  getPageContent,
  getPublishedFAQs,
  getPublishedTestimonials,
} from "@/lib/data";
import { defaultFAQs, defaultHomeContent, defaultTestimonials } from "@/lib/default-content";
import type { FAQItem, Product, TestimonialItem } from "@/types";
import {
  ArrowRight,
  CalendarDays,
  MapPin,
  Search,
  ShoppingCart,
  Sparkles,
  Tag,
  Truck,
} from "lucide-react";
import Link from "next/link";

const ICON_MAP = {
  search: Search,
  cart: ShoppingCart,
  "map-pin": MapPin,
} as const;

function HeroImage({ src, alt }: { src?: string; alt: string }) {
  if (!src) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-3xl border border-border bg-muted lg:aspect-square">
        <Sparkles className="h-16 w-16 text-primary/30" />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-border shadow-lg">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src.startsWith("/api/images/") || src.startsWith("http") ? src : src}
        alt={alt}
        className="aspect-[4/3] w-full object-cover lg:aspect-square"
      />
    </div>
  );
}

export default async function HomePage() {
  const [pageData, featuredProducts, testimonials, faqs, categories] =
    await Promise.all([
      getPageContent("home"),
      getFeaturedProducts(8),
      getPublishedTestimonials(3),
      getPublishedFAQs(4),
      getCategories(),
    ]);

  const content = { ...defaultHomeContent, ...(pageData.content as typeof defaultHomeContent) };

  const displayTestimonials = (
    testimonials.length > 0
      ? testimonials
      : defaultTestimonials.map((item, index) => ({
          ...item,
          _id: `default-testimonial-${index}`,
        }))
  ) as TestimonialItem[];

  const displayFaqs = (
    faqs.length > 0
      ? faqs
      : defaultFAQs.slice(0, 4).map((item, index) => ({
          ...item,
          _id: `default-faq-${index}`,
        }))
  ) as FAQItem[];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-background via-card to-muted/50">
        <div className="container-page section-padding">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="max-w-xl">
              {content.hero.eyebrow && (
                <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
                  <MapPin className="h-3.5 w-3.5" />
                  {content.hero.eyebrow}
                </p>
              )}
              <h1 className="font-display text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                {content.hero.title}
              </h1>
              {content.hero.subtitle && (
                <p className="mt-4 font-display text-xl text-primary sm:text-2xl">
                  {content.hero.subtitle}
                </p>
              )}
              <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
                {content.hero.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href={content.hero.primaryButton.href} className="btn-primary">
                  {content.hero.primaryButton.label}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href={content.hero.secondaryButton.href}
                  className="btn-secondary"
                >
                  {content.hero.secondaryButton.label}
                </Link>
              </div>
            </div>
            <HeroImage
              src={content.hero.image}
              alt={content.hero.title}
            />
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-padding">
        <div className="container-page">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                Featured Finds
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
                Fresh From the Hunt
              </h2>
              <p className="mt-3 max-w-2xl text-muted-foreground">
                Hand-picked items from our latest inventory — reserve online for local pickup.
              </p>
            </div>
            <Link href="/shop" className="btn-secondary shrink-0">
              View All Products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {featuredProducts.length > 0 ? (
            <ProductGrid products={featuredProducts as unknown as Product[]} />
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
              <p className="text-muted-foreground">
                New items are being added — check back soon or browse the full shop.
              </p>
              <Link href="/shop" className="btn-primary mt-6 inline-flex">
                Browse Shop
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="border-y border-border bg-muted/30 section-padding">
        <div className="container-page">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">
              {content.howItWorks.title}
            </h2>
            <p className="mt-3 text-muted-foreground">
              {content.howItWorks.subtitle}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {content.howItWorks.steps.map((step, index) => {
              const Icon =
                ICON_MAP[step.icon as keyof typeof ICON_MAP] ?? Search;

              return (
                <div
                  key={step.title}
                  className="relative rounded-2xl border border-border bg-card p-6 shadow-sm"
                >
                  <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="absolute right-5 top-5 font-display text-4xl font-semibold text-primary/10">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-xl font-semibold">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="section-padding">
        <div className="container-page">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                Our Story
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
                {content.about.title}
              </h2>
              <p className="mt-6 leading-relaxed text-muted-foreground">
                {content.about.content}
              </p>
              {content.about.secondaryContent && (
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  {content.about.secondaryContent}
                </p>
              )}
              <Link
                href={content.about.cta.href}
                className="btn-primary mt-8 inline-flex"
              >
                {content.about.cta.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="rounded-3xl border border-border bg-gradient-to-br from-primary/5 via-card to-secondary/20 p-8 lg:p-10">
              <div className="grid gap-4 sm:grid-cols-2">
                {content.whyShop.items.slice(0, 2).map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-border bg-card p-5"
                  >
                    <h3 className="font-display text-lg font-semibold">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Sale */}
      {content.upcomingSale.enabled && (
        <section className="border-y border-border bg-primary text-primary-foreground">
          <div className="container-page section-padding">
            <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
              <CalendarDays className="h-10 w-10 opacity-90" />
              <h2 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">
                {content.upcomingSale.title}
              </h2>
              <p className="mt-4 text-base leading-relaxed opacity-90 sm:text-lg">
                {content.upcomingSale.description}
              </p>
              <a
                href={content.upcomingSale.cta.href}
                target={
                  content.upcomingSale.cta.href.startsWith("http")
                    ? "_blank"
                    : undefined
                }
                rel={
                  content.upcomingSale.cta.href.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                className="mt-8 inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 bg-primary-foreground/10 px-6 py-3 text-sm font-semibold transition hover:bg-primary-foreground/20"
              >
                {content.upcomingSale.cta.label}
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="section-padding">
        <div className="container-page">
          <div className="mb-10 text-center">
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">
              {content.categories.title}
            </h2>
            <p className="mt-3 text-muted-foreground">
              {content.categories.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {categories.map((category) => (
              <Link
                key={category.slug ?? category.name}
                href={`/shop?category=${encodeURIComponent(category.name)}`}
                className="group flex flex-col items-center rounded-2xl border border-border bg-card p-5 text-center transition hover:-translate-y-1 hover:border-primary hover:shadow-lg"
              >
                <span className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                  <Tag className="h-5 w-5" />
                </span>
                <span className="text-sm font-semibold">{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Shop */}
      <section className="border-y border-border bg-muted/30 section-padding">
        <div className="container-page">
          <div className="mb-10 text-center">
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">
              {content.whyShop.title}
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {content.whyShop.items.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-success/10 text-success">
                  <Truck className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg font-semibold">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding">
        <div className="container-page">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-3xl font-semibold sm:text-4xl">
                {content.testimonials.title}
              </h2>
              <p className="mt-3 text-muted-foreground">
                {content.testimonials.subtitle}
              </p>
            </div>
            <Link href="/testimonials" className="btn-secondary shrink-0">
              Read All Reviews
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {displayTestimonials.map((testimonial) => (
              <TestimonialCard
                key={testimonial._id}
                testimonial={testimonial}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="border-t border-border bg-muted/20 section-padding">
        <div className="container-page">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-3xl font-semibold sm:text-4xl">
                {content.faq.title}
              </h2>
              <p className="mt-3 text-muted-foreground">
                {content.faq.subtitle}
              </p>
            </div>
            <Link href="/faq" className="btn-secondary shrink-0">
              View All FAQs
            </Link>
          </div>
          <div className="mx-auto max-w-3xl">
            <FAQAccordion items={displayFaqs} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container-page">
          <div className="rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-card to-secondary/20 px-8 py-14 text-center sm:px-12 sm:py-16">
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">
              {content.cta.title}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              {content.cta.description}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href={content.cta.primaryButton.href} className="btn-primary">
                {content.cta.primaryButton.label}
              </Link>
              <Link
                href={content.cta.secondaryButton.href}
                className="btn-secondary"
              >
                {content.cta.secondaryButton.label}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
