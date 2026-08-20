"use client";

import { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminTable } from "@/components/admin/AdminTable";
import { useToast } from "@/components/admin/Toast";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea } from "@/components/ui/Input";
import { Edit, Plus, Trash2 } from "lucide-react";

interface Testimonial {
  _id: string;
  customerName: string;
  testimonial: string;
  rating: number;
  date?: string;
  published?: boolean;
  featured?: boolean;
  sortOrder?: number;
}

const emptyForm = {
  customerName: "",
  testimonial: "",
  rating: 5,
  published: true,
  featured: false,
  sortOrder: 0,
};

export default function TestimonialsPage() {
  const { toast } = useToast();
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const loadItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/testimonials");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load testimonials");
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadItems();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (item: Testimonial) => {
    setEditingId(item._id);
    setForm({
      customerName: item.customerName,
      testimonial: item.testimonial,
      rating: item.rating,
      published: item.published ?? true,
      featured: item.featured ?? false,
      sortOrder: item.sortOrder ?? 0,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = editingId
        ? `/api/admin/testimonials/${editingId}`
        : "/api/admin/testimonials";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save testimonial");

      toast(editingId ? "Testimonial updated" : "Testimonial created", "success");
      resetForm();
      void loadItems();
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Failed to save testimonial",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;

    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete testimonial");
      toast("Testimonial deleted", "success");
      void loadItems();
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Failed to delete testimonial",
        "error",
      );
    }
  };

  return (
    <>
      <AdminHeader
        title="Testimonials"
        description="Manage customer testimonials."
        actions={
          <Button
            size="sm"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Add Testimonial
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
              {editingId ? "Edit Testimonial" : "New Testimonial"}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="customerName">Customer Name *</Label>
                <Input
                  id="customerName"
                  value={form.customerName}
                  onChange={(e) =>
                    setForm({ ...form, customerName: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="rating">Rating (1-5)</Label>
                <Input
                  id="rating"
                  type="number"
                  min="1"
                  max="5"
                  value={form.rating}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      rating: parseInt(e.target.value, 10) || 5,
                    })
                  }
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="testimonial">Testimonial *</Label>
                <Textarea
                  id="testimonial"
                  value={form.testimonial}
                  onChange={(e) =>
                    setForm({ ...form, testimonial: e.target.value })
                  }
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
              <div className="flex flex-col justify-end gap-2">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={(e) =>
                      setForm({ ...form, published: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-border"
                  />
                  Published
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) =>
                      setForm({ ...form, featured: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-border"
                  />
                  Featured
                </label>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button type="submit" loading={saving}>
                {editingId ? "Save Changes" : "Create Testimonial"}
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
              key: "customer",
              header: "Customer",
              render: (item: Testimonial) => (
                <div>
                  <p className="font-medium">{item.customerName}</p>
                  <p className="text-xs text-muted-foreground">
                    {"★".repeat(item.rating)}
                  </p>
                </div>
              ),
            },
            {
              key: "testimonial",
              header: "Testimonial",
              render: (item: Testimonial) => (
                <p className="line-clamp-2 max-w-md text-sm">{item.testimonial}</p>
              ),
            },
            {
              key: "flags",
              header: "Flags",
              render: (item: Testimonial) => (
                <div className="flex flex-wrap gap-1">
                  {item.published && (
                    <span className="badge bg-success/10 text-success">Published</span>
                  )}
                  {item.featured && (
                    <span className="badge bg-primary/10 text-primary">Featured</span>
                  )}
                </div>
              ),
            },
            {
              key: "actions",
              header: "Actions",
              render: (item: Testimonial) => (
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => handleEdit(item)}
                    className="rounded-lg p-2 hover:bg-muted"
                    aria-label="Edit testimonial"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDelete(item._id)}
                    className="rounded-lg p-2 text-danger hover:bg-muted"
                    aria-label="Delete testimonial"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ),
            },
          ]}
          data={items}
          loading={loading}
          error={error}
          rowKey={(item) => item._id}
        />
      </main>
    </>
  );
}
