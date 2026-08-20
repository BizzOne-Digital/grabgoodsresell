"use client";

import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Edit, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useToast } from "@/components/admin/Toast";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

interface FAQ {
  _id: string;
  question: string;
  answer: string;
  published?: boolean;
  sortOrder?: number;
}

const emptyForm = {
  question: "",
  answer: "",
  published: true,
  sortOrder: 0,
};

function SortableFaqRow({
  faq,
  onEdit,
  onDelete,
}: {
  faq: FAQ;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: faq._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-start gap-3 rounded-xl border border-border bg-card p-4",
        isDragging && "z-10 shadow-lg",
      )}
    >
      <button
        type="button"
        className="mt-1 rounded-md p-1 text-muted-foreground hover:bg-muted"
        aria-label="Drag to reorder"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <div className="min-w-0 flex-1">
        <p className="font-medium">{faq.question}</p>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
          {faq.answer}
        </p>
        {!faq.published && (
          <span className="badge mt-2 bg-muted">Draft</span>
        )}
      </div>

      <div className="flex gap-1">
        <button
          type="button"
          onClick={onEdit}
          className="rounded-lg p-2 hover:bg-muted"
          aria-label="Edit FAQ"
        >
          <Edit className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="rounded-lg p-2 text-danger hover:bg-muted"
          aria-label="Delete FAQ"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default function FAQPage() {
  const { toast } = useToast();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [reordering, setReordering] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const loadFaqs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/faq");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load FAQs");
      setFaqs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load FAQs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadFaqs();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (faq: FAQ) => {
    setEditingId(faq._id);
    setForm({
      question: faq.question,
      answer: faq.answer,
      published: faq.published ?? true,
      sortOrder: faq.sortOrder ?? 0,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = editingId ? `/api/admin/faq/${editingId}` : "/api/admin/faq";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save FAQ");

      toast(editingId ? "FAQ updated" : "FAQ created", "success");
      resetForm();
      void loadFaqs();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to save FAQ", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this FAQ?")) return;

    try {
      const res = await fetch(`/api/admin/faq/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete FAQ");
      toast("FAQ deleted", "success");
      void loadFaqs();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to delete FAQ", "error");
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = faqs.findIndex((f) => f._id === active.id);
    const newIndex = faqs.findIndex((f) => f._id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(faqs, oldIndex, newIndex);
    setFaqs(reordered);
    setReordering(true);

    try {
      await Promise.all(
        reordered.map((faq, index) =>
          fetch(`/api/admin/faq/${faq._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              question: faq.question,
              answer: faq.answer,
              published: faq.published ?? true,
              sortOrder: index,
            }),
          }),
        ),
      );
      toast("FAQ order updated", "success");
    } catch {
      toast("Failed to save order", "error");
      void loadFaqs();
    } finally {
      setReordering(false);
    }
  };

  return (
    <>
      <AdminHeader
        title="FAQ"
        description="Manage frequently asked questions. Drag to reorder."
        actions={
          <Button
            size="sm"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Add FAQ
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
              {editingId ? "Edit FAQ" : "New FAQ"}
            </h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="question">Question *</Label>
                <Input
                  id="question"
                  value={form.question}
                  onChange={(e) => setForm({ ...form, question: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="answer">Answer *</Label>
                <Textarea
                  id="answer"
                  value={form.answer}
                  onChange={(e) => setForm({ ...form, answer: e.target.value })}
                  required
                />
              </div>
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
            </div>
            <div className="mt-4 flex gap-2">
              <Button type="submit" loading={saving}>
                {editingId ? "Save Changes" : "Create FAQ"}
              </Button>
              <Button type="button" variant="secondary" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </form>
        )}

        {loading && (
          <p className="text-sm text-muted-foreground">Loading FAQs...</p>
        )}

        {error && (
          <div className="rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {reordering && (
              <p className="text-sm text-muted-foreground">Saving order...</p>
            )}
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(e) => void handleDragEnd(e)}
            >
              <SortableContext
                items={faqs.map((f) => f._id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {faqs.length === 0 ? (
                    <p className="rounded-xl border border-border bg-card px-4 py-12 text-center text-sm text-muted-foreground">
                      No FAQs yet.
                    </p>
                  ) : (
                    faqs.map((faq) => (
                      <SortableFaqRow
                        key={faq._id}
                        faq={faq}
                        onEdit={() => handleEdit(faq)}
                        onDelete={() => void handleDelete(faq._id)}
                      />
                    ))
                  )}
                </div>
              </SortableContext>
            </DndContext>
          </>
        )}
      </main>
    </>
  );
}
