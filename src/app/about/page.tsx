import { getPageContent } from "@/lib/data";
import { defaultAboutContent } from "@/lib/default-content";
import { MARKETING_IMAGES } from "@/lib/marketing-images";
import type { Metadata } from "next";
import Link from "next/link";

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getPageContent("about");
  const seo = pageData.seo as { title?: string; description?: string };

  return {
    title: seo?.title || "About Us",
    description:
      seo?.description ||
      "Learn about Grab My Goods Resell — a local resale business in Waxahachie, Texas built on trust and great finds.",
  };
}

export default async function AboutPage() {
  const pageData = await getPageContent("about");
  const content = {
    ...defaultAboutContent,
    ...(pageData.content as typeof defaultAboutContent),
  };
  const heroImage = content.hero.image || MARKETING_IMAGES.aboutStory;

  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-background via-card to-muted/40">
        <div className="container-page grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              About Us
            </p>
            <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">
              {content.hero.title}
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              {content.hero.subtitle}
            </p>
          </div>
          <div className="overflow-hidden rounded-3xl border border-border shadow-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroImage}
              alt={content.hero.title}
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-page">
          <div className="grid items-start gap-12 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-3xl font-semibold">
                {content.story.title}
              </h2>
              <div className="mt-6 space-y-5 text-muted-foreground">
                {content.story.paragraphs.map((paragraph, index) => (
                  <p key={index} className="leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
            <div className="overflow-hidden rounded-3xl border border-border shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={MARKETING_IMAGES.hero}
                alt="Curated resale finds"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-muted/30 section-padding">
        <div className="container-page">
          <h2 className="mb-10 text-center font-display text-3xl font-semibold">
            {content.values.title}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {content.values.items.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-border bg-card p-6 text-center"
              >
                <h3 className="font-display text-lg font-semibold">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-page">
          <div className="rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-card to-secondary/20 px-8 py-14 text-center">
            <h2 className="font-display text-3xl font-semibold">
              {content.cta.title}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              {content.cta.description}
            </p>
            <Link href={content.cta.button.href} className="btn-primary mt-8 inline-flex">
              {content.cta.button.label}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
