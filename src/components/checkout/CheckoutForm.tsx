"use client";

import { Button } from "@/components/ui/Button";
import { Input, Label, Select, Textarea } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import type { CheckoutFormData } from "@/types";
import { FormEvent, useState } from "react";

interface CheckoutFormProps {
  onSubmit: (data: CheckoutFormData) => void | Promise<void>;
  loading?: boolean;
  className?: string;
  pickupInfo?: string;
}

const initialState: CheckoutFormData = {
  name: "",
  email: "",
  phone: "",
  notes: "",
  pickupPreference: "",
};

export function CheckoutForm({
  onSubmit,
  loading = false,
  className,
  pickupInfo = "Local pickup only. We will contact you to confirm pickup details after your order is placed.",
}: CheckoutFormProps) {
  const [form, setForm] = useState<CheckoutFormData>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormData, string>>>({});

  const updateField = <K extends keyof CheckoutFormData>(
    key: K,
    value: CheckoutFormData[K],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const validate = () => {
    const nextErrors: Partial<Record<keyof CheckoutFormData, string>> = {};

    if (!form.name.trim()) {
      nextErrors.name = "Name is required";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Enter a valid email address";
    }

    if (!form.phone.trim()) {
      nextErrors.phone = "Phone number is required";
    } else if (form.phone.trim().length < 7) {
      nextErrors.phone = "Enter a valid phone number";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;
    await onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "rounded-2xl border border-border bg-card p-6 sm:p-8",
        className,
      )}
      noValidate
    >
      <div className="mb-6">
        <h2 className="font-display text-2xl font-semibold">
          Contact Information
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          We&apos;ll use this information to confirm your order and schedule
          local pickup.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="checkout-name">Full name</Label>
          <Input
            id="checkout-name"
            name="name"
            autoComplete="name"
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "checkout-name-error" : undefined}
          />
          {errors.name && (
            <p id="checkout-name-error" className="mt-1 text-xs text-danger">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="checkout-email">Email</Label>
          <Input
            id="checkout-email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "checkout-email-error" : undefined}
          />
          {errors.email && (
            <p id="checkout-email-error" className="mt-1 text-xs text-danger">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="checkout-phone">Phone</Label>
          <Input
            id="checkout-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "checkout-phone-error" : undefined}
          />
          {errors.phone && (
            <p id="checkout-phone-error" className="mt-1 text-xs text-danger">
              {errors.phone}
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="checkout-pickup">Pickup preference</Label>
          <Select
            id="checkout-pickup"
            name="pickupPreference"
            value={form.pickupPreference}
            onChange={(event) =>
              updateField("pickupPreference", event.target.value)
            }
          >
            <option value="">Select a preferred time</option>
            <option value="weekday_morning">Weekday morning</option>
            <option value="weekday_afternoon">Weekday afternoon</option>
            <option value="weekday_evening">Weekday evening</option>
            <option value="weekend">Weekend</option>
            <option value="flexible">Flexible — contact me to schedule</option>
          </Select>
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="checkout-notes">Order notes (optional)</Label>
          <Textarea
            id="checkout-notes"
            name="notes"
            placeholder="Any special requests or questions about your order..."
            value={form.notes}
            onChange={(event) => updateField("notes", event.target.value)}
          />
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-background p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">
          Pickup Information
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {pickupInfo}
        </p>
      </div>

      <Button
        type="submit"
        size="lg"
        loading={loading}
        className="mt-6 w-full"
      >
        Place Order
      </Button>
    </form>
  );
}
