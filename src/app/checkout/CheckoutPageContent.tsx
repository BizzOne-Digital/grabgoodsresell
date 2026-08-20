"use client";

import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { useCart } from "@/contexts/CartContext";
import type { CheckoutFormData } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CheckoutPageContentProps {
  pickupInfo?: string;
}

export function CheckoutPageContent({ pickupInfo }: CheckoutPageContentProps) {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (data: CheckoutFormData) => {
    if (items.length === 0) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            name: data.name,
            email: data.email,
            phone: data.phone,
          },
          items: items.map((item) => ({
            productId: item.productId,
            name: item.name,
            slug: item.slug,
            price: item.price,
            salePrice: item.salePrice,
            quantity: item.quantity,
            image: item.image,
            condition: item.condition,
          })),
          notes: data.notes || undefined,
          pickupPreference: data.pickupPreference || undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to place order");
      }

      const orderNumber = result.order?.orderNumber;
      clearCart();
      router.push(
        `/order-confirmation${orderNumber ? `?order=${encodeURIComponent(orderNumber)}` : ""}`,
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <EmptyState
        icon="cart"
        title="Nothing to checkout"
        description="Your cart is empty. Add items from the shop before checking out."
        action={
          <Link href="/shop">
            <Button size="lg">Browse Shop</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
      <div>
        <CheckoutForm
          onSubmit={handleSubmit}
          loading={loading}
          pickupInfo={pickupInfo}
        />
        {error && (
          <p className="mt-4 rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">
            {error}
          </p>
        )}
      </div>

      <OrderSummary items={items} subtotal={subtotal} className="h-fit lg:sticky lg:top-24" />
    </div>
  );
}
