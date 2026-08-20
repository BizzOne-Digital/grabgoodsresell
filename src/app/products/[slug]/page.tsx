import { ProductActions } from "@/app/products/[slug]/ProductActions";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { getProductBySlug, getRelatedProducts, getSiteSettings } from "@/lib/data";
import { getEffectivePrice } from "@/lib/utils";
import type { Product, ProductImage } from "@/types";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  const title =
    ("metaTitle" in product && product.metaTitle) || product.name;
  const description =
    ("metaDescription" in product && product.metaDescription) ||
    product.shortDescription ||
    product.description?.slice(0, 160) ||
    `${product.name} — available at Grab My Goods Resell.`;

  const primaryImage = product.images?.[0] as ProductImage | undefined;
  const imageUrl =
    product.thumbnail ||
    primaryImage?.url ||
    (primaryImage?.fileId ? `/api/images/${primaryImage.fileId}` : undefined);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      ...(imageUrl ? { images: [{ url: imageUrl, alt: product.name }] } : {}),
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const rawProduct = await getProductBySlug(slug);

  if (!rawProduct) {
    notFound();
  }

  const product = rawProduct as unknown as Product;

  const [relatedProducts, settings] = await Promise.all([
    getRelatedProducts(product.category, product._id, 4),
    getSiteSettings(),
  ]);

  const primaryImage = product.images[0];
  const imageUrl =
    product.thumbnail ||
    primaryImage?.url ||
    (primaryImage?.fileId ? `/api/images/${primaryImage.fileId}` : undefined);

  const effectivePrice = getEffectivePrice(product.price, product.salePrice);
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || product.shortDescription,
    image: imageUrl ? [`${siteUrl}${imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`}`] : [],
    sku: product.sku || product.slug,
    brand: {
      "@type": "Brand",
      name: settings.businessName,
    },
    offers: {
      "@type": "Offer",
      url: `${siteUrl}/products/${product.slug}`,
      priceCurrency: "USD",
      price: effectivePrice,
      availability:
        product.quantity > 0 && product.status === "active"
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: `https://schema.org/${product.condition === "New" ? "NewCondition" : "UsedCondition"}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="border-b border-border bg-muted/20">
        <div className="container-page py-6">
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="transition hover:text-primary">
                  Home
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href="/shop" className="transition hover:text-primary">
                  Shop
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link
                  href={`/shop?category=${encodeURIComponent(product.category)}`}
                  className="transition hover:text-primary"
                >
                  {product.category}
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="font-medium text-foreground">{product.name}</li>
            </ol>
          </nav>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-page">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <ProductGallery
              images={product.images as ProductImage[]}
              productName={product.name}
            />

            <div>
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="badge bg-muted text-muted-foreground">
                  {product.category}
                </span>
                <span className="badge border border-border bg-background">
                  {product.condition}
                </span>
                {product.featured && (
                  <span className="badge bg-primary/10 text-primary">Featured</span>
                )}
                {product.isNew && (
                  <span className="badge bg-success/10 text-success">New</span>
                )}
              </div>

              <h1 className="font-display text-3xl font-semibold sm:text-4xl lg:text-5xl">
                {product.name}
              </h1>

              {product.shortDescription && (
                <p className="mt-4 text-lg text-muted-foreground">
                  {product.shortDescription}
                </p>
              )}

              <div className="mt-8 border-t border-border pt-8">
                <ProductActions product={product} imageUrl={imageUrl} />
              </div>

              {product.description && (
                <div className="mt-10 border-t border-border pt-8">
                  <h2 className="font-display text-xl font-semibold">
                    Description
                  </h2>
                  <div className="prose prose-sm mt-4 max-w-none text-muted-foreground">
                    {product.description.split("\n").map((paragraph, index) => (
                      <p key={index} className="mb-3 last:mb-0">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {product.tags && product.tags.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="badge border border-border bg-background text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="border-t border-border bg-muted/20 section-padding">
          <div className="container-page">
            <h2 className="mb-8 font-display text-2xl font-semibold sm:text-3xl">
              You May Also Like
            </h2>
            <ProductGrid products={relatedProducts as unknown as Product[]} />
          </div>
        </section>
      )}
    </>
  );
}
