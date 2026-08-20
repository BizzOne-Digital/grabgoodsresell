"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useToast } from "@/components/admin/Toast";
import { Button } from "@/components/ui/Button";
import { Label, Select } from "@/components/ui/Input";
import { ORDER_STATUSES, PAYMENT_STATUSES } from "@/lib/constants";
import { formatDate, formatPrice } from "@/lib/utils";

interface OrderDetail {
  _id: string;
  orderNumber: string;
  customer: { name: string; email: string; phone: string };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    salePrice?: number;
    condition?: string;
  }>;
  subtotal: number;
  total: number;
  notes?: string;
  pickupPreference?: string;
  status: string;
  paymentStatus: string;
  createdAt?: string;
}

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const { toast } = useToast();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadOrder() {
      try {
        const res = await fetch(`/api/admin/orders/${params.id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load order");
        setOrder(data);
        setStatus(data.status);
        setPaymentStatus(data.paymentStatus);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load order");
      } finally {
        setLoading(false);
      }
    }

    void loadOrder();
  }, [params.id]);

  const handleUpdateStatus = async () => {
    if (!order) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/orders/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, paymentStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update order");

      setOrder(data);
      toast("Order updated successfully", "success");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to update order", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <AdminHeader
        title={order?.orderNumber || "Order Detail"}
        description="Review order details and update status."
        actions={
          <Link href="/admin/orders">
            <Button variant="secondary" size="sm">
              Back to Orders
            </Button>
          </Link>
        }
      />

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        {loading && (
          <p className="text-sm text-muted-foreground">Loading order...</p>
        )}

        {error && (
          <div className="rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
            {error}
          </div>
        )}

        {order && (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <section className="rounded-xl border border-border bg-card p-5">
                <h2 className="mb-4 text-lg font-semibold">Items</h2>
                <ul className="divide-y divide-border">
                  {order.items.map((item, index) => (
                    <li
                      key={`${item.name}-${index}`}
                      className="flex items-start justify-between py-3"
                    >
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Qty {item.quantity}
                          {item.condition && ` · ${item.condition}`}
                        </p>
                      </div>
                      <p className="font-medium">
                        {formatPrice(
                          (item.salePrice && item.salePrice < item.price
                            ? item.salePrice
                            : item.price) * item.quantity,
                        )}
                      </p>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex justify-between border-t border-border pt-4 text-sm">
                  <span>Subtotal</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="mt-2 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </section>

              {(order.notes || order.pickupPreference) && (
                <section className="rounded-xl border border-border bg-card p-5">
                  <h2 className="mb-3 text-lg font-semibold">Notes</h2>
                  {order.pickupPreference && (
                    <p className="text-sm">
                      <span className="font-medium">Pickup preference: </span>
                      {order.pickupPreference}
                    </p>
                  )}
                  {order.notes && (
                    <p className="mt-2 text-sm text-muted-foreground">{order.notes}</p>
                  )}
                </section>
              )}
            </div>

            <div className="space-y-6">
              <section className="rounded-xl border border-border bg-card p-5">
                <h2 className="mb-4 text-lg font-semibold">Customer</h2>
                <dl className="space-y-2 text-sm">
                  <div>
                    <dt className="text-muted-foreground">Name</dt>
                    <dd className="font-medium">{order.customer.name}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Email</dt>
                    <dd>{order.customer.email}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Phone</dt>
                    <dd>{order.customer.phone}</dd>
                  </div>
                  {order.createdAt && (
                    <div>
                      <dt className="text-muted-foreground">Placed</dt>
                      <dd>{formatDate(order.createdAt)}</dd>
                    </div>
                  )}
                </dl>
              </section>

              <section className="rounded-xl border border-border bg-card p-5">
                <h2 className="mb-4 text-lg font-semibold">Update Status</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="status">Order Status</Label>
                    <Select
                      id="status"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      {ORDER_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="paymentStatus">Payment Status</Label>
                    <Select
                      id="paymentStatus"
                      value={paymentStatus}
                      onChange={(e) => setPaymentStatus(e.target.value)}
                    >
                      {PAYMENT_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <Button
                    className="w-full"
                    loading={saving}
                    onClick={() => void handleUpdateStatus()}
                  >
                    Save Status
                  </Button>
                </div>
              </section>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
