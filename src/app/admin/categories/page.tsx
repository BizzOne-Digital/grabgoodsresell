"use client";

import { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminTable } from "@/components/admin/AdminTable";
import { useToast } from "@/components/admin/Toast";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea } from "@/components/ui/Input";
import { Edit, Plus, Trash2 } from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  sortOrder?: number;
  isActive?: boolean;
}

const emptyForm = {
  name: "",
  description: "",
  sortOrder: 0,
  isActive: true,
};

export default function CategoriesPage() {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const loadCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load categories");
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadCategories();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (category: Category) => {
    setEditingId(category._id);
    setForm({
      name: category.name,
      description: category.description || "",
      sortOrder: category.sortOrder ?? 0,
      isActive: category.isActive ?? true,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = editingId
        ? `/api/admin/categories/${editingId}`
        : "/api/admin/categories";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save category");

      toast(
        editingId ? "Category updated" : "Category created",
        "success",
      );
      resetForm();
      void loadCategories();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to save category", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return;

    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete category");
      toast("Category deleted", "success");
      void loadCategories();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to delete category", "error");
    }
  };

  return (
    <>
      <AdminHeader
        title="Categories"
        description="Manage product categories."
        actions={
          <Button
            size="sm"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Add Category
          </Button>
        }
      />

      <main className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="rounded-xl border border-border bg-card p-5"
          >
            <h2 className="mb-4 text-lg font-semibold">
              {editingId ? "Edit Category" : "New Category"}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="sortOrder">Sort Order</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      sortOrder: parseInt(e.target.value, 10) || 0,
                    })
                  }
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>
              <label className="flex items-center gap-2 text-sm sm:col-span-2">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) =>
                    setForm({ ...form, isActive: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-border"
                />
                Active
              </label>
            </div>
            <div className="mt-4 flex gap-2">
              <Button type="submit" loading={saving}>
                {editingId ? "Save Changes" : "Create Category"}
              </Button>
              <Button type="button" variant="secondary" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </form>
        )}

        <AdminTable
          columns={[
            {
              key: "name",
              header: "Name",
              render: (cat: Category) => (
                <div>
                  <p className="font-medium">{cat.name}</p>
                  <p className="text-xs text-muted-foreground">{cat.slug}</p>
                </div>
              ),
            },
            {
              key: "sortOrder",
              header: "Order",
              render: (cat: Category) => cat.sortOrder ?? 0,
            },
            {
              key: "status",
              header: "Status",
              render: (cat: Category) => (
                <span
                  className={`badge ${cat.isActive ? "bg-success/10 text-success" : "bg-muted"}`}
                >
                  {cat.isActive ? "Active" : "Inactive"}
                </span>
              ),
            },
            {
              key: "actions",
              header: "Actions",
              render: (cat: Category) => (
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => handleEdit(cat)}
                    className="rounded-lg p-2 hover:bg-muted"
                    aria-label="Edit category"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDelete(cat._id)}
                    className="rounded-lg p-2 text-danger hover:bg-muted"
                    aria-label="Delete category"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ),
            },
          ]}
          data={categories}
          loading={loading}
          error={error}
          rowKey={(cat) => cat._id}
        />
      </main>
    </>
  );
}
