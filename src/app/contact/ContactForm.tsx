"use client";

import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";
import { FormEvent, useState } from "react";

interface ContactFormProps {
  formTitle?: string;
  className?: string;
}

export function ContactForm({
  formTitle = "Send a Message",
  className,
}: ContactFormProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  const updateField = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    setServerError("");
  };

  const validate = () => {
    const nextErrors: Partial<Record<keyof typeof form, string>> = {};

    if (!form.name.trim()) nextErrors.name = "Name is required";
    if (!form.email.trim()) {
      nextErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Enter a valid email address";
    }
    if (!form.message.trim()) {
      nextErrors.message = "Message is required";
    } else if (form.message.trim().length < 10) {
      nextErrors.message = "Message must be at least 10 characters";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setServerError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || undefined,
          message: form.message.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setSuccess(true);
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      setServerError(
        error instanceof Error ? error.message : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div
        className={cn(
          "rounded-2xl border border-border bg-card p-8 text-center",
          className,
        )}
      >
        <CheckCircle2 className="mx-auto h-12 w-12 text-success" />
        <h2 className="mt-4 font-display text-2xl font-semibold">
          Message Sent!
        </h2>
        <p className="mt-2 text-muted-foreground">
          Thank you for reaching out. We&apos;ll get back to you as soon as possible.
        </p>
        <Button
          variant="secondary"
          className="mt-6"
          onClick={() => setSuccess(false)}
        >
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "rounded-2xl border border-border bg-card p-6 sm:p-8",
        className,
      )}
      noValidate
    >
      <h2 className="font-display text-2xl font-semibold">{formTitle}</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Fill out the form below and we&apos;ll respond promptly.
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="contact-name">Full name</Label>
          <Input
            id="contact-name"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            aria-invalid={Boolean(errors.name)}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-danger">{errors.name}</p>
          )}
        </div>

        <div>
          <Label htmlFor="contact-email">Email</Label>
          <Input
            id="contact-email"
            type="email"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            aria-invalid={Boolean(errors.email)}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-danger">{errors.email}</p>
          )}
        </div>

        <div>
          <Label htmlFor="contact-phone">Phone (optional)</Label>
          <Input
            id="contact-phone"
            type="tel"
            value={form.phone}
            onChange={(e) => updateField("phone", e.target.value)}
          />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="contact-message">Message</Label>
          <Textarea
            id="contact-message"
            rows={5}
            placeholder="Tell us about the item you're interested in or ask a question..."
            value={form.message}
            onChange={(e) => updateField("message", e.target.value)}
            aria-invalid={Boolean(errors.message)}
          />
          {errors.message && (
            <p className="mt-1 text-xs text-danger">{errors.message}</p>
          )}
        </div>
      </div>

      {serverError && (
        <p className="mt-4 rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">
          {serverError}
        </p>
      )}

      <Button type="submit" size="lg" loading={loading} className="mt-6 w-full">
        Send Message
      </Button>
    </form>
  );
}
