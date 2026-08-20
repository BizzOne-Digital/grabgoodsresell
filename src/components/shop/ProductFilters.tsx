"use client";

import { Button } from "@/components/ui/Button";
import { Input, Label, Select } from "@/components/ui/Input";
import { PRODUCT_CONDITIONS, SORT_OPTIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { ProductFilterState } from "@/types";
import { Filter, Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useId, useState } from "react";

export const DEFAULT_PRODUCT_FILTERS: ProductFilterState = {
  q: "",
  category: "",
  condition: "",
  minPrice: "",
  maxPrice: "",
  availability: "",
  featured: false,
  isNew: false,
  isSale: false,
  sort: "newest",
};

interface ProductFiltersProps {
  filters: ProductFilterState;
  categories: string[];
  onChange: (filters: ProductFilterState) => void;
  onReset?: () => void;
  className?: string;
  resultCount?: number;
}

function FilterFields({
  filters,
  categories,
  onChange,
  idPrefix,
}: {
  filters: ProductFilterState;
  categories: string[];
  onChange: (filters: ProductFilterState) => void;
  idPrefix: string;
}) {
  const update = <K extends keyof ProductFilterState>(
    key: K,
    value: ProductFilterState[K],
  ) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="space-y-5">
      <div>
        <Label htmlFor={`${idPrefix}-search`}>Search</Label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id={`${idPrefix}-search`}
            type="search"
            placeholder="Search products..."
            value={filters.q}
            onChange={(event) => update("q", event.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div>
        <Label htmlFor={`${idPrefix}-category`}>Category</Label>
        <Select
          id={`${idPrefix}-category`}
          value={filters.category}
          onChange={(event) => update("category", event.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Label htmlFor={`${idPrefix}-condition`}>Condition</Label>
        <Select
          id={`${idPrefix}-condition`}
          value={filters.condition}
          onChange={(event) => update("condition", event.target.value)}
        >
          <option value="">All conditions</option>
          {PRODUCT_CONDITIONS.map((condition) => (
            <option key={condition} value={condition}>
              {condition}
            </option>
          ))}
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor={`${idPrefix}-min-price`}>Min price</Label>
          <Input
            id={`${idPrefix}-min-price`}
            type="number"
            min="0"
            step="0.01"
            placeholder="0"
            value={filters.minPrice}
            onChange={(event) => update("minPrice", event.target.value)}
          />
        </div>
        <div>
          <Label htmlFor={`${idPrefix}-max-price`}>Max price</Label>
          <Input
            id={`${idPrefix}-max-price`}
            type="number"
            min="0"
            step="0.01"
            placeholder="Any"
            value={filters.maxPrice}
            onChange={(event) => update("maxPrice", event.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor={`${idPrefix}-availability`}>Availability</Label>
        <Select
          id={`${idPrefix}-availability`}
          value={filters.availability}
          onChange={(event) => update("availability", event.target.value)}
        >
          <option value="">All items</option>
          <option value="in_stock">In stock</option>
          <option value="out_of_stock">Out of stock</option>
        </Select>
      </div>

      <fieldset>
        <legend className="mb-3 block text-sm font-medium text-foreground">
          Highlights
        </legend>
        <div className="space-y-2">
          {[
            { key: "featured" as const, label: "Featured only" },
            { key: "isNew" as const, label: "New arrivals" },
            { key: "isSale" as const, label: "On sale" },
          ].map(({ key, label }) => (
            <label
              key={key}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-background px-3 py-2.5 text-sm transition hover:bg-muted"
            >
              <input
                type="checkbox"
                checked={filters[key]}
                onChange={(event) => update(key, event.target.checked)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary/30"
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <Label htmlFor={`${idPrefix}-sort`}>Sort by</Label>
        <Select
          id={`${idPrefix}-sort`}
          value={filters.sort}
          onChange={(event) => update("sort", event.target.value)}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
}

export function ProductFilters({
  filters,
  categories,
  onChange,
  onReset,
  className,
  resultCount,
}: ProductFiltersProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const desktopId = useId();
  const mobileId = useId();

  const activeFilterCount = [
    filters.q,
    filters.category,
    filters.condition,
    filters.minPrice,
    filters.maxPrice,
    filters.availability,
    filters.featured,
    filters.isNew,
    filters.isSale,
    filters.sort !== "newest" ? filters.sort : "",
  ].filter(Boolean).length;

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleReset = () => {
    onReset?.();
    onChange(DEFAULT_PRODUCT_FILTERS);
    setMobileOpen(false);
  };

  return (
    <>
      <div className={cn("lg:hidden", className)}>
        <div className="mb-4 flex items-center justify-between gap-3">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => setMobileOpen(true)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                {activeFilterCount}
              </span>
            )}
          </Button>

          <div className="min-w-[140px]">
            <Select
              aria-label="Sort products"
              value={filters.sort}
              onChange={(event) =>
                onChange({ ...filters, sort: event.target.value })
              }
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {resultCount !== undefined && (
          <p className="mb-4 text-sm text-muted-foreground">
            {resultCount} {resultCount === 1 ? "product" : "products"} found
          </p>
        )}

        {mobileOpen && (
          <>
            <div
              className="fixed inset-0 z-50 bg-foreground/30"
              onClick={() => setMobileOpen(false)}
              aria-hidden
            />
            <div className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-hidden rounded-t-3xl border border-border bg-card shadow-2xl">
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-primary" />
                  <h2 className="font-display text-lg font-semibold">Filters</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-full p-2 transition hover:bg-muted"
                  aria-label="Close filters"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="overflow-y-auto px-5 py-5">
                <FilterFields
                  filters={filters}
                  categories={categories}
                  onChange={onChange}
                  idPrefix={mobileId}
                />
              </div>

              <div className="grid grid-cols-2 gap-3 border-t border-border px-5 py-4">
                <Button variant="secondary" onClick={handleReset}>
                  Reset
                </Button>
                <Button onClick={() => setMobileOpen(false)}>
                  Show Results
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      <aside
        className={cn(
          "hidden rounded-2xl border border-border bg-card p-5 lg:block",
          className,
        )}
      >
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-primary" />
            <h2 className="font-display text-lg font-semibold">Filters</h2>
          </div>
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={handleReset}
              className="text-xs font-medium text-primary transition hover:underline"
            >
              Reset all
            </button>
          )}
        </div>

        {resultCount !== undefined && (
          <p className="mb-5 text-sm text-muted-foreground">
            {resultCount} {resultCount === 1 ? "product" : "products"} found
          </p>
        )}

        <FilterFields
          filters={filters}
          categories={categories}
          onChange={onChange}
          idPrefix={desktopId}
        />
      </aside>
    </>
  );
}
