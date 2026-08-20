import { cn, formatDate } from "@/lib/utils";
import type { TestimonialItem } from "@/types";
import { Quote, Star } from "lucide-react";

interface TestimonialCardProps {
  testimonial: TestimonialItem;
  className?: string;
}

function StarRating({ rating }: { rating: number }) {
  const normalizedRating = Math.max(0, Math.min(5, Math.round(rating)));

  return (
    <div
      className="flex items-center gap-1"
      role="img"
      aria-label={`${normalizedRating} out of 5 stars`}
    >
      {Array.from({ length: 5 }, (_, index) => {
        const filled = index < normalizedRating;

        return (
          <Star
            key={index}
            className={cn(
              "h-4 w-4",
              filled
                ? "fill-warning text-warning"
                : "fill-muted text-muted",
            )}
            aria-hidden
          />
        );
      })}
    </div>
  );
}

export function TestimonialCard({
  testimonial,
  className,
}: TestimonialCardProps) {
  return (
    <article
      className={cn(
        "relative flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm",
        testimonial.featured && "ring-2 ring-primary/15",
        className,
      )}
    >
      <Quote
        className="absolute right-5 top-5 h-8 w-8 text-primary/15"
        aria-hidden
      />

      <StarRating rating={testimonial.rating} />

      <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground sm:text-base">
        &ldquo;{testimonial.testimonial}&rdquo;
      </blockquote>

      <footer className="mt-6 border-t border-border pt-4">
        <p className="font-display text-base font-semibold">
          {testimonial.customerName}
        </p>
        {testimonial.date && (
          <p className="mt-1 text-xs text-muted-foreground">
            {formatDate(testimonial.date)}
          </p>
        )}
      </footer>
    </article>
  );
}
