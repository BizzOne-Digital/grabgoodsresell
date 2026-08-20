"use client";

import { useRouter } from "next/navigation";
import {
  AdminProductForm,
  type ProductFormData,
} from "@/components/admin/AdminProductForm";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useToast } from "@/components/admin/Toast";

export default function NewProductPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (data: ProductFormData) => {
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || "Failed to create product");
    }

    toast("Product created successfully", "success");
    router.push(`/admin/products/${result._id}`);
  };

  return (
    <>
      <AdminHeader
        title="New Product"
        description="Add a new item to your inventory."
      />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <AdminProductForm onSubmit={handleSubmit} submitLabel="Create Product" />
      </main>
    </>
  );
}
