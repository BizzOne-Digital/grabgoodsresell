"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AdminProductForm,
  type ProductFormData,
} from "@/components/admin/AdminProductForm";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useToast } from "@/components/admin/Toast";
import type { Product } from "@/types";

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch(`/api/admin/products/${params.id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load product");
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load product");
      } finally {
        setLoading(false);
      }
    }

    void loadProduct();
  }, [params.id]);

  const handleSubmit = async (data: ProductFormData) => {
    const res = await fetch(`/api/admin/products/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || "Failed to update product");
    }

    toast("Product updated successfully", "success");
    setProduct(result);
    router.refresh();
  };

  return (
    <>
      <AdminHeader
        title={product?.name || "Edit Product"}
        description="Update product details and images."
      />

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        {loading && (
          <p className="text-sm text-muted-foreground">Loading product...</p>
        )}

        {error && (
          <div className="rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
            {error}
          </div>
        )}

        {product && (
          <AdminProductForm
            initialData={product}
            onSubmit={handleSubmit}
            submitLabel="Save Changes"
          />
        )}
      </main>
    </>
  );
}
