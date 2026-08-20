"use client";

import { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useToast } from "@/components/admin/Toast";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea } from "@/components/ui/Input";
import type { SiteSettingsData } from "@/types";

const defaultSettings: SiteSettingsData = {
  businessName: "",
  tagline: "",
  phone: "",
  email: "",
  socialLinks: [],
  businessDescription: "",
  primaryColor: "#C45C3E",
  secondaryColor: "#D4C4B0",
  accentColor: "#2D2A26",
  announcementBar: { enabled: true, text: "", link: "" },
  footerText: "",
  copyright: "",
  pickupInfo: "",
  businessHours: "",
  seo: { title: "", description: "" },
};

export default function SettingsPage() {
  const { toast } = useToast();
  const [form, setForm] = useState<SiteSettingsData>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/admin/settings");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load settings");
        setForm({ ...defaultSettings, ...data });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load settings");
      } finally {
        setLoading(false);
      }
    }

    void loadSettings();
  }, []);

  const updateField = <K extends keyof SiteSettingsData>(
    key: K,
    value: SiteSettingsData[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save settings");

      setForm({ ...defaultSettings, ...data });
      toast("Settings saved successfully", "success");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to save settings", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <AdminHeader
        title="Site Settings"
        description="Configure business info, branding, and SEO."
      />

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        {loading && (
          <p className="text-sm text-muted-foreground">Loading settings...</p>
        )}

        {error && (
          <div className="rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
            {error}
          </div>
        )}

        {!loading && !error && (
          <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-8">
            <section className="space-y-4 rounded-xl border border-border bg-card p-5">
              <h2 className="text-lg font-semibold">Business Info</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    value={form.businessName}
                    onChange={(e) => updateField("businessName", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input
                    id="tagline"
                    value={form.tagline}
                    onChange={(e) => updateField("tagline", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="businessDescription">Description</Label>
                  <Textarea
                    id="businessDescription"
                    value={form.businessDescription}
                    onChange={(e) =>
                      updateField("businessDescription", e.target.value)
                    }
                  />
                </div>
              </div>
            </section>

            <section className="space-y-4 rounded-xl border border-border bg-card p-5">
              <h2 className="text-lg font-semibold">Branding</h2>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <Input
                    id="primaryColor"
                    value={form.primaryColor}
                    onChange={(e) => updateField("primaryColor", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <Input
                    id="secondaryColor"
                    value={form.secondaryColor}
                    onChange={(e) =>
                      updateField("secondaryColor", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="accentColor">Accent Color</Label>
                  <Input
                    id="accentColor"
                    value={form.accentColor}
                    onChange={(e) => updateField("accentColor", e.target.value)}
                  />
                </div>
              </div>
            </section>

            <section className="space-y-4 rounded-xl border border-border bg-card p-5">
              <h2 className="text-lg font-semibold">Announcement Bar</h2>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.announcementBar.enabled}
                  onChange={(e) =>
                    updateField("announcementBar", {
                      ...form.announcementBar,
                      enabled: e.target.checked,
                    })
                  }
                  className="h-4 w-4 rounded border-border"
                />
                Enabled
              </label>
              <div>
                <Label htmlFor="announcementText">Text</Label>
                <Input
                  id="announcementText"
                  value={form.announcementBar.text}
                  onChange={(e) =>
                    updateField("announcementBar", {
                      ...form.announcementBar,
                      text: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="announcementLink">Link (optional)</Label>
                <Input
                  id="announcementLink"
                  value={form.announcementBar.link || ""}
                  onChange={(e) =>
                    updateField("announcementBar", {
                      ...form.announcementBar,
                      link: e.target.value,
                    })
                  }
                />
              </div>
            </section>

            <section className="space-y-4 rounded-xl border border-border bg-card p-5">
              <h2 className="text-lg font-semibold">Footer & Pickup</h2>
              <div>
                <Label htmlFor="footerText">Footer Text</Label>
                <Textarea
                  id="footerText"
                  value={form.footerText}
                  onChange={(e) => updateField("footerText", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="copyright">Copyright</Label>
                <Input
                  id="copyright"
                  value={form.copyright}
                  onChange={(e) => updateField("copyright", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="pickupInfo">Pickup Info</Label>
                <Textarea
                  id="pickupInfo"
                  value={form.pickupInfo}
                  onChange={(e) => updateField("pickupInfo", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="businessHours">Business Hours</Label>
                <Input
                  id="businessHours"
                  value={form.businessHours}
                  onChange={(e) => updateField("businessHours", e.target.value)}
                />
              </div>
            </section>

            <section className="space-y-4 rounded-xl border border-border bg-card p-5">
              <h2 className="text-lg font-semibold">Social & SEO</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="facebook">Facebook URL</Label>
                  <Input
                    id="facebook"
                    value={form.facebook || ""}
                    onChange={(e) => updateField("facebook", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="instagram">Instagram URL</Label>
                  <Input
                    id="instagram"
                    value={form.instagram || ""}
                    onChange={(e) => updateField("instagram", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="seoTitle">SEO Title</Label>
                  <Input
                    id="seoTitle"
                    value={form.seo.title}
                    onChange={(e) =>
                      updateField("seo", { ...form.seo, title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="seoDescription">SEO Description</Label>
                  <Input
                    id="seoDescription"
                    value={form.seo.description}
                    onChange={(e) =>
                      updateField("seo", {
                        ...form.seo,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </section>

            <Button type="submit" loading={saving}>
              Save Settings
            </Button>
          </form>
        )}
      </main>
    </>
  );
}
