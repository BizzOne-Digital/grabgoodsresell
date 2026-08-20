import { ShopContent } from "@/app/shop/ShopContent";
import { queryProducts } from "@/lib/api-helpers";
import { getCategories } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse our full inventory of resale finds — vintage, household goods, collectibles, and more. Local pickup in Waxahachie, Texas.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: initialCategory } = await searchParams;

  const [{ products, pagination }, categories] = await Promise.all([
    queryProducts({
      page: "1",
      limit: "12",
      ...(initialCategory ? { category: initialCategory } : {}),
    }),
    getCategories(),
  ]);

  const categoryNames = categories.map((category) => category.name);

  return (
    <>
      <section className="border-b border-border bg-muted/30">
        <div className="container-page py-12 sm:py-16">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Full Inventory
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold sm:text-5xl">
            Shop All Finds
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Explore our constantly changing inventory. Filter by category, condition,
            price, and more — then reserve items for local pickup.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-page">
          <ShopContent
            initialProducts={products}
            initialPagination={pagination}
            categories={categoryNames}
            initialCategory={initialCategory ?? ""}
          />
        </div>
      </section>
    </>
  );
}
