"use client";

import { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useToast } from "@/components/admin/Toast";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

const PAGES = [
  { id: "home", label: "Homepage" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
  { id: "booking", label: "Booking" },
  { id: "pricing", label: "Pricing" },
] as const;

type PageId = (typeof PAGES)[number]["id"];

interface PageContentData {
  page: PageId;
  content: Record<string, unknown>;
  draftContent: Record<string, unknown>;
  published?: boolean;
  seo?: { title?: string; description?: string };
}

export default function ContentPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<PageId>("home");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draftJson, setDraftJson] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [published, setPublished] = useState(false);

  useEffect(() => {
    async function loadContent() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/admin/content/${activeTab}`);
        const data: PageContentData = await res.json();
        if (!res.ok) throw new Error((data as { error?: string }).error || "Failed to load content");

        setDraftJson(JSON.stringify(data.draftContent || data.content || {}, null, 2));
        setSeoTitle(data.seo?.title || "");
        setSeoDescription(data.seo?.description || "");
        setPublished(data.published ?? false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load content");
      } finally {
        setLoading(false);
      }
    }

    void loadContent();
  }, [activeTab]);

  const parseDraft = () => {
    try {
      return JSON.parse(draftJson) as Record<string, unknown>;
    } catch {
      throw new Error("Invalid JSON in content editor");
    }
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      const draftContent = parseDraft();
      const res = await fetch(`/api/admin/content/${activeTab}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          draftContent,
          seo: { title: seoTitle, description: seoDescription },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save draft");

      toast("Draft saved", "success");
      setPublished(data.published ?? false);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to save draft", "error");
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    setPublishing(true);
    try {
      const draftContent = parseDraft();
      const res = await fetch(`/api/admin/content/${activeTab}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          draftContent,
          publish: true,
          seo: { title: seoTitle, description: seoDescription },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to publish");

      toast("Content published", "success");
      setPublished(true);
      setDraftJson(JSON.stringify(data.content || draftContent, null, 2));
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to publish", "error");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <>
      <AdminHeader
        title="Page Content"
        description="Edit storefront page content by section."
      />

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mb-6 flex flex-wrap gap-2 border-b border-border pb-4">
          {PAGES.map((page) => (
            <button
              key={page.id}
              type="button"
              onClick={() => setActiveTab(page.id)}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium transition",
                activeTab === page.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/50 hover:bg-muted",
              )}
            >
              {page.label}
            </button>
          ))}
        </div>

        {loading && (
          <p className="text-sm text-muted-foreground">Loading content...</p>
        )}

        {error && (
          <div className="rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={cn(
                  "badge",
                  published ? "bg-success/10 text-success" : "bg-warning/10 text-warning",
                )}
              >
                {published ? "Published" : "Draft only"}
              </span>
            </div>

            <div className="grid gap-4 rounded-xl border border-border bg-card p-5 lg:grid-cols-2">
              <div>
                <Label htmlFor="seoTitle">SEO Title</Label>
                <Input
                  id="seoTitle"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="seoDescription">SEO Description</Label>
                <Input
                  id="seoDescription"
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                />
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <Label htmlFor="draftContent">Draft Content (JSON)</Label>
              <p className="mb-2 text-xs text-muted-foreground">
                Edit the page content structure. Save as draft or publish to make it live.
              </p>
              <Textarea
                id="draftContent"
                value={draftJson}
                onChange={(e) => setDraftJson(e.target.value)}
                className="min-h-[420px] font-mono text-xs"
                spellCheck={false}
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <Button loading={saving} onClick={() => void handleSaveDraft()}>
                Save Draft
              </Button>
              <Button
                variant="secondary"
                loading={publishing}
                onClick={() => void handlePublish()}
              >
                Publish
              </Button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
