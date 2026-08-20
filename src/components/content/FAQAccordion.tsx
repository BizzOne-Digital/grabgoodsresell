"use client";

import { cn } from "@/lib/utils";
import type { FAQItem } from "@/types";
import { ChevronDown } from "lucide-react";
import { useId, useState } from "react";

interface FAQAccordionProps {
  items: FAQItem[];
  className?: string;
  allowMultiple?: boolean;
}

export function FAQAccordion({
  items,
  className,
  allowMultiple = false,
}: FAQAccordionProps) {
  const baseId = useId();
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems((current) => {
      const isOpen = current.includes(id);

      if (allowMultiple) {
        return isOpen
          ? current.filter((itemId) => itemId !== id)
          : [...current, id];
      }

      return isOpen ? [] : [id];
    });
  };

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center text-sm text-muted-foreground">
        No FAQs available yet.
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {items.map((item, index) => {
        const isOpen = openItems.includes(item._id);
        const buttonId = `${baseId}-button-${index}`;
        const panelId = `${baseId}-panel-${index}`;

        return (
          <div
            key={item._id}
            className="overflow-hidden rounded-2xl border border-border bg-card"
          >
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggleItem(item._id)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-muted/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary"
              >
                <span className="font-display text-base font-semibold sm:text-lg">
                  {item.question}
                </span>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 shrink-0 text-primary transition-transform duration-200",
                    isOpen && "rotate-180",
                  )}
                  aria-hidden
                />
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className={cn(
                "border-t border-border px-5 transition-all",
                isOpen ? "py-4" : "py-0",
              )}
            >
              {isOpen && (
                <div className="prose prose-sm max-w-none text-sm leading-relaxed text-muted-foreground">
                  {item.answer}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
