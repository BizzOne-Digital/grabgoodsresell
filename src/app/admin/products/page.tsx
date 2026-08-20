"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminTable } from "@/components/admin/AdminTable";
import { useToast } from "@/components/admin/Toast";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { PRODUCT_STATUSES } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";
import { Copy, Edit, Plus, Trash2 } from "lucide-react";

interface ProductsResponse {
  products: Product[];
  pagination: {
    page: number;
    totalPages: number;
    total: number;
  };
}

function ProductsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);

  const q = searchParams.get("q") || "";
  const status = searchParams.get("status") || "";
  const page = searchParams.get("page") || "1";

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (status) params.set("status", status);
      params.set("page", page);
      params.set("limit", "20");

      const res = await fetch(`/api/admin/products?${params.toString()}`);
      const data: ProductsResponse = await res.json();
      if (!res.ok) throw new Error((data as { error?: string }).error || "Failed to load products");

      setProducts(data.products);
      setSelected(new Set());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [q, status, page]);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  const updateFilters = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    params.delete("page");
    router.push(`/admin/products?${params.toString()}`);
  };

  const handleBulkAction = async (
    action: "publish" | "hide" | "sold" | "archive",
  ) => {
    if (selected.size === 0) {
      toast("Select at least one product", "error");
      return;
    }

    setBulkLoading(true);
    try {
      const res = await fetch("/api/admin/products/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ids: Array.from(selected) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Bulk action failed");

      toast(`Updated ${data.modified} product(s)`, "success");
      void loadProducts();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Bulk action failed", "error");
    } finally {
      setBulkLoading(false);
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/products/${id}/duplicate`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Duplicate failed");
      toast("Product duplicated", "success");
      router.push(`/admin/products/${data._id}`);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Duplicate failed", "error");
    }
  };

  const handleArchive = async (id: string) => {
    if (!confirm("Archive this product?")) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Archive failed");
      toast("Product archived", "success");
      void loadProducts();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Archive failed", "error");
    }
  };

  const allSelected = useMemo(
    () => products.length > 0 && selected.size === products.length,
    [products.length, selected.size],
  );

  const columns = useMemo(
    () => [
      {
        key: "name",
        header: "Product",
        render: (product: Product) => (
          <div>
            <p className="font-medium">{product.name}</p>
            <p className="text-xs text-muted-foreground">{product.category}</p>
          </div>
        ),
      },
      {
        key: "price",
        header: "Price",
        render: (product: Product) => formatPrice(product.price),
      },
      {
        key: "quantity",
        header: "Qty",
        className: "hidden sm:table-cell",
        render: (product: Product) => product.quantity,
      },
      {
        key: "status",
        header: "Status",
        render: (product: Product) => (
          <span className="badge bg-muted capitalize">{product.status}</span>
        ),
      },
      {
        key: "actions",
        header: "Actions",
        render: (product: Product) => (
          <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
            <Link
              href={`/admin/products/${product._id}`}
              className="rounded-lg p-2 hover:bg-muted"
              aria-label="Edit product"
            >
              <Edit className="h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={() => void handleDuplicate(product._id)}
              className="rounded-lg p-2 hover:bg-muted"
              aria-label="Duplicate product"
            >
              <Copy className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => void handleArchive(product._id)}
              className="rounded-lg p-2 hover:bg-muted text-danger"
              aria-label="Archive product"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <>
      <AdminHeader
        title="Products"
        description="Manage your inventory."
        actions={
          <Link href="/admin/products/new">
            <Button size="sm">
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </Link>
        }
      />

      <main className="flex-1 space-y-4 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center">
          <Input
            placeholder="Search products..."
            defaultValue={q}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                updateFilters({ q: e.currentTarget.value });
              }
            }}
            className="sm:max-w-xs"
          />
          <Select
            value={status}
            onChange={(e) => updateFilters({ status: e.target.value })}
            className="sm:max-w-[180px]"
          >
            <option value="">All statuses</option>
            {PRODUCT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </Select>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              const input = document.querySelector<HTMLInputElement>(
                'input[placeholder="Search products..."]',
              );
              updateFilters({ q: input?.value || "" });
            }}
          >
            Search
          </Button>
        </div>

        {selected.size > 0 && (
          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-muted/30 p-3">
            <span className="text-sm font-medium">{selected.size} selected</span>
            <Button
              size="sm"
              variant="secondary"
              loading={bulkLoading}
              onClick={() => void handleBulkAction("publish")}
            >
              Publish
            </Button>
            <Button
              size="sm"
              variant="secondary"
              loading={bulkLoading}
              onClick={() => void handleBulkAction("hide")}
            >
              Hide
            </Button>
            <Button
              size="sm"
              variant="secondary"
              loading={bulkLoading}
              onClick={() => void handleBulkAction("sold")}
            >
              Mark Sold
            </Button>
            <Button
              size="sm"
              variant="danger"
              loading={bulkLoading}
              onClick={() => void handleBulkAction("archive")}
            >
              Archive
            </Button>
          </div>
        )}

        <AdminTable
          columns={columns}
          data={products}
          loading={loading}
          error={error}
          rowKey={(product) => product._id}
          onRowClick={(product) => router.push(`/admin/products/${product._id}`)}
          selectable
          selectedIds={selected}
          allSelected={allSelected}
          onSelectAll={(checked) => {
            setSelected(
              checked ? new Set(products.map((p) => p._id)) : new Set(),
            );
          }}
          onSelectRow={(id, checked) => {
            setSelected((prev) => {
              const next = new Set(prev);
              if (checked) next.add(id);
              else next.delete(id);
              return next;
            });
          }}
        />
      </main>
    </>
  );
}

export default function AdminProductsPage() {
  return (
    <Suspense fallback={<p className="p-8 text-sm text-muted-foreground">Loading...</p>}>
      <ProductsPageContent />
    </Suspense>
  );
}
