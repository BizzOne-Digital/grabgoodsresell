import { TestimonialCard } from "@/components/content/TestimonialCard";
import { getPublishedTestimonials } from "@/lib/data";
import { defaultTestimonials } from "@/lib/default-content";
import type { TestimonialItem } from "@/types";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Testimonials",
  description:
    "Read what local customers say about Grab My Goods Resell — fair prices, friendly service, and great finds.",
};

export default async function TestimonialsPage() {
  const testimonials = await getPublishedTestimonials();

  const displayTestimonials = (
    testimonials.length > 0
      ? testimonials
      : defaultTestimonials.map((item, index) => ({
          ...item,
          _id: `default-testimonial-${index}`,
        }))
  ) as TestimonialItem[];

  return (
    <>
      <section className="border-b border-border bg-gradient-to-br from-background via-card to-muted/40">
        <div className="container-page py-16 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Customer Reviews
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">
            What Customers Say
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Real feedback from local buyers who have shopped with us. We&apos;re
            proud to serve our Waxahachie community with honest listings and friendly
            pickup.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-page">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {displayTestimonials.map((testimonial) => (
              <TestimonialCard
                key={testimonial._id}
                testimonial={testimonial}
              />
            ))}
          </div>

          <div className="mt-16 rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-card to-secondary/20 px-8 py-12 text-center">
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">
              Ready to Shop?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Browse our inventory and find your next treasure — local pickup in
              Waxahachie, Texas.
            </p>
            <Link href="/shop" className="btn-primary mt-6 inline-flex">
              Browse Shop
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
