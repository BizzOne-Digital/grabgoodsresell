"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select, Textarea } from "@/components/ui/Input";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { useToast } from "@/components/admin/Toast";
import { PRODUCT_CONDITIONS, PRODUCT_STATUSES } from "@/lib/constants";
import type { Product, ProductImage } from "@/types";

interface CategoryOption {
  _id: string;
  name: string;
}

export interface ProductFormData {
  name: string;
  price: number;
  category: string;
  condition: (typeof PRODUCT_CONDITIONS)[number];
  description: string;
  quantity: number;
  status: (typeof PRODUCT_STATUSES)[number];
  featured: boolean;
  images: ProductImage[];
  thumbnail?: string;
}

interface AdminProductFormProps {
  initialData?: Partial<Product>;
  onSubmit: (data: ProductFormData) => Promise<void>;
  submitLabel?: string;
}

const defaultForm: ProductFormData = {
  name: "",
  price: 0,
  category: "",
  condition: "Good",
  description: "",
  quantity: 1,
  status: "draft",
  featured: false,
  images: [],
  thumbnail: "",
};

export function AdminProductForm({
  initialData,
  onSubmit,
  submitLabel = "Save Product",
}: AdminProductFormProps) {
  const { toast } = useToast();
  const [form, setForm] = useState<ProductFormData>(defaultForm);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        price: initialData.price ?? 0,
        category: initialData.category || "",
        condition: initialData.condition || "Good",
        description: initialData.description || "",
        quantity: initialData.quantity ?? 1,
        status: initialData.status || "draft",
        featured: initialData.featured ?? false,
        images: initialData.images || [],
        thumbnail: initialData.thumbnail || initialData.images?.[0]?.url || "",
      });
    }
  }, [initialData]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/admin/categories");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load categories");
        setCategories(data);
      } catch (err) {
        toast(
          err instanceof Error ? err.message : "Failed to load categories",
          "error",
        );
      } finally {
        setLoadingCategories(false);
      }
    }

    void loadCategories();
  }, [toast]);

  const updateField = <K extends keyof ProductFormData>(
    key: K,
    value: ProductFormData[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.name.trim()) {
      setError("Product name is required.");
      return;
    }

    if (!form.category) {
      setError("Category is required.");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        ...form,
        thumbnail: form.thumbnail || form.images[0]?.url || "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save product");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-xl border border-border bg-card p-5">
          <h2 className="text-lg font-semibold">Basic Info</h2>

          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="Product name"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) =>
                  updateField("price", parseFloat(e.target.value) || 0)
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                value={form.quantity}
                onChange={(e) =>
                  updateField("quantity", parseInt(e.target.value, 10) || 0)
                }
              />
            </div>
          </div>

          <div>
            <Label htmlFor="category">Category *</Label>
            <Select
              id="category"
              value={form.category}
              onChange={(e) => updateField("category", e.target.value)}
              required
              disabled={loadingCategories}
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="condition">Condition</Label>
              <Select
                id="condition"
                value={form.condition}
                onChange={(e) =>
                  updateField(
                    "condition",
                    e.target.value as ProductFormData["condition"],
                  )
                }
              >
                {PRODUCT_CONDITIONS.map((condition) => (
                  <option key={condition} value={condition}>
                    {condition}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                id="status"
                value={form.status}
                onChange={(e) =>
                  updateField(
                    "status",
                    e.target.value as ProductFormData["status"],
                  )
                }
              >
                {PRODUCT_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Describe the product..."
              rows={5}
            />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => updateField("featured", e.target.checked)}
              className="h-4 w-4 rounded border-border"
            />
            Featured product
          </label>
        </div>

        <div className="space-y-4 rounded-xl border border-border bg-card p-5">
          <h2 className="text-lg font-semibold">Images</h2>
          <ImageUploader
            images={form.images}
            onChange={(images) => updateField("images", images)}
            primaryUrl={form.thumbnail}
            onPrimaryChange={(url) => updateField("thumbnail", url)}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" loading={submitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
