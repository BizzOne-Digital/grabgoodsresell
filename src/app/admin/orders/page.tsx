"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminTable } from "@/components/admin/AdminTable";
import { Select } from "@/components/ui/Input";
import { ORDER_STATUSES } from "@/lib/constants";
import { formatDate, formatPrice } from "@/lib/utils";

interface OrderRow {
  _id: string;
  orderNumber: string;
  customer: { name: string; email: string };
  total: number;
  status: string;
  paymentStatus: string;
  createdAt?: string;
}

interface OrdersResponse {
  orders: OrderRow[];
  pagination: { total: number };
}

function OrdersPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get("status") || "";

  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ limit: "50" });
      if (status) params.set("status", status);

      const res = await fetch(`/api/admin/orders?${params.toString()}`);
      const data: OrdersResponse = await res.json();
      if (!res.ok) throw new Error((data as { error?: string }).error || "Failed to load orders");
      setOrders(data.orders);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  const columns = useMemo(
    () => [
      {
        key: "orderNumber",
        header: "Order",
        render: (order: OrderRow) => (
          <div>
            <p className="font-medium">{order.orderNumber}</p>
            <p className="text-xs text-muted-foreground">
              {order.createdAt ? formatDate(order.createdAt) : "—"}
            </p>
          </div>
        ),
      },
      {
        key: "customer",
        header: "Customer",
        render: (order: OrderRow) => (
          <div>
            <p>{order.customer.name}</p>
            <p className="text-xs text-muted-foreground">{order.customer.email}</p>
          </div>
        ),
      },
      {
        key: "total",
        header: "Total",
        render: (order: OrderRow) => formatPrice(order.total),
      },
      {
        key: "status",
        header: "Status",
        render: (order: OrderRow) => (
          <span className="badge bg-muted capitalize">
            {order.status.replace(/_/g, " ")}
          </span>
        ),
      },
      {
        key: "payment",
        header: "Payment",
        className: "hidden md:table-cell",
        render: (order: OrderRow) => (
          <span className="badge bg-muted capitalize">{order.paymentStatus}</span>
        ),
      },
    ],
    [],
  );

  return (
    <>
      <AdminHeader title="Orders" description="View and manage customer orders." />

      <main className="flex-1 space-y-4 p-4 sm:p-6 lg:p-8">
        <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
          <Select
            value={status}
            onChange={(e) => {
              const params = new URLSearchParams();
              if (e.target.value) params.set("status", e.target.value);
              router.push(`/admin/orders?${params.toString()}`);
            }}
            className="max-w-[220px]"
          >
            <option value="">All statuses</option>
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              </option>
            ))}
          </Select>
        </div>

        <AdminTable
          columns={columns}
          data={orders}
          loading={loading}
          error={error}
          emptyMessage="No orders found."
          rowKey={(order) => order._id}
          onRowClick={(order) => router.push(`/admin/orders/${order._id}`)}
        />
      </main>
    </>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={<p className="p-8 text-sm text-muted-foreground">Loading...</p>}>
      <OrdersPageContent />
    </Suspense>
  );
}
