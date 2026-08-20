"use client";

import { Button } from "@/components/ui/Button";
import { LoadingState } from "@/components/ui/EmptyState";
import {
  DEFAULT_PRODUCT_FILTERS,
  ProductFilters,
} from "@/components/shop/ProductFilters";
import { ProductGrid } from "@/components/shop/ProductGrid";
import type { Product, ProductFilterState } from "@/types";
import { useCallback, useEffect, useRef, useState } from "react";

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

interface ShopContentProps {
  initialProducts: Product[];
  initialPagination: Pagination;
  categories: string[];
  initialCategory?: string;
}

function buildQueryString(filters: ProductFilterState, page: number) {
  const params = new URLSearchParams();

  if (filters.q) params.set("q", filters.q);
  if (filters.category) params.set("category", filters.category);
  if (filters.condition) params.set("condition", filters.condition);
  if (filters.minPrice) params.set("minPrice", filters.minPrice);
  if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
  if (filters.availability) params.set("availability", filters.availability);
  if (filters.featured) params.set("featured", "true");
  if (filters.isNew) params.set("isNew", "true");
  if (filters.isSale) params.set("isSale", "true");
  if (filters.sort && filters.sort !== "newest") params.set("sort", filters.sort);
  params.set("page", String(page));
  params.set("limit", "12");

  return params.toString();
}

export function ShopContent({
  initialProducts,
  initialPagination,
  categories,
  initialCategory = "",
}: ShopContentProps) {
  const [filters, setFilters] = useState<ProductFilterState>({
    ...DEFAULT_PRODUCT_FILTERS,
    category: initialCategory,
  });
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [pagination, setPagination] = useState<Pagination>(initialPagination);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const isFirstRender = useRef(true);

  const fetchProducts = useCallback(
    async (nextFilters: ProductFilterState, page: number, append = false) => {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      try {
        const query = buildQueryString(nextFilters, page);
        const response = await fetch(`/api/products?${query}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch products");
        }

        setProducts((current) =>
          append ? [...current, ...data.products] : data.products,
        );
        setPagination(data.pagination);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        if (!append) {
          setProducts([]);
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      fetchProducts(filters, 1);
    }, filters.q ? 350 : 0);

    return () => clearTimeout(timer);
  }, [filters, fetchProducts]);

  const handleLoadMore = () => {
    if (pagination.hasMore && !loadingMore) {
      fetchProducts(filters, pagination.page + 1, true);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <ProductFilters
        filters={filters}
        categories={categories}
        onChange={setFilters}
        resultCount={pagination.total}
      />

      <div>
        <ProductFilters
          filters={filters}
          categories={categories}
          onChange={setFilters}
          resultCount={pagination.total}
          className="lg:hidden"
        />

        {loading ? (
          <LoadingState message="Finding products..." />
        ) : (
          <>
            <ProductGrid products={products} />

            {pagination.hasMore && (
              <div className="mt-10 text-center">
                <Button
                  variant="secondary"
                  size="lg"
                  loading={loadingMore}
                  onClick={handleLoadMore}
                >
                  Load More Products
                </Button>
                <p className="mt-3 text-sm text-muted-foreground">
                  Showing {products.length} of {pagination.total} products
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
