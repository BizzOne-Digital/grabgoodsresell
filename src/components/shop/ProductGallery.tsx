"use client";

import { cn } from "@/lib/utils";
import type { ProductImage as ProductImageType } from "@/types";
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import { useState } from "react";

function GalleryImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const useNativeImg =
    src.startsWith("http") ||
    src.startsWith("/api/images/") ||
    src.includes("gridfs");

  if (useNativeImg) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} className={className} />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={className} />
  );
}

interface ProductGalleryProps {
  images: ProductImageType[];
  productName: string;
  className?: string;
}

export function ProductGallery({
  images,
  productName,
  className,
}: ProductGalleryProps) {
  const resolvedImages = images.map((image) => ({
    ...image,
    url:
      image.url ||
      (image.fileId ? `/api/images/${image.fileId}` : ""),
  })).filter((image) => image.url);

  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = resolvedImages[activeIndex];

  const goTo = (index: number) => {
    if (resolvedImages.length === 0) return;
    setActiveIndex((index + resolvedImages.length) % resolvedImages.length);
  };

  if (resolvedImages.length === 0) {
    return (
      <div
        className={cn(
          "flex aspect-square items-center justify-center rounded-2xl border border-border bg-muted text-muted-foreground",
          className,
        )}
      >
        <div className="text-center">
          <ImageIcon className="mx-auto h-10 w-10" />
          <p className="mt-3 text-sm">No image available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="relative overflow-hidden rounded-2xl border border-border bg-muted">
        <div className="aspect-square">
          <GalleryImage
            src={activeImage.url}
            alt={activeImage.alt || `${productName} image ${activeIndex + 1}`}
            className="h-full w-full object-cover"
          />
        </div>

        {resolvedImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo(activeIndex - 1)}
              className="absolute left-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card/95 text-foreground shadow-sm transition hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => goTo(activeIndex + 1)}
              className="absolute right-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card/95 text-foreground shadow-sm transition hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {resolvedImages.length > 1 && (
        <div
          className="grid grid-cols-4 gap-3 sm:grid-cols-5"
          role="tablist"
          aria-label="Product image thumbnails"
        >
          {resolvedImages.map((image, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={`${image.url}-${index}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Show image ${index + 1}`}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "relative aspect-square overflow-hidden rounded-xl border bg-muted transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                  isActive
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-border hover:border-primary/50",
                )}
              >
                <GalleryImage
                  src={image.url}
                  alt={image.alt || `${productName} thumbnail ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
