"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { formatDate, formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  soldProducts: number;
  hiddenProducts: number;
  totalOrders: number;
  pendingOrders: number;
  recentProducts: Product[];
  recentOrders: Array<{
    _id: string;
    orderNumber: string;
    customer: { name: string };
    total: number;
    status: string;
    createdAt?: string;
  }>;
}

function StatCard({
  label,
  value,
  href,
}: {
  label: string;
  value: number;
  href?: string;
}) {
  const content = (
    <div className="rounded-xl border border-border bg-card p-5 transition hover:shadow-sm">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }

  return content;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("/api/admin/dashboard");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load dashboard");
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    }

    void loadStats();
  }, []);

  return (
    <>
      <AdminHeader
        title="Dashboard"
        description="Overview of your store activity."
      />

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        {loading && (
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        )}

        {error && (
          <div className="rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
            {error}
          </div>
        )}

        {stats && (
          <div className="space-y-8">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <StatCard
                label="Total Products"
                value={stats.totalProducts}
                href="/admin/products"
              />
              <StatCard
                label="Active Products"
                value={stats.activeProducts}
                href="/admin/products?status=active"
              />
              <StatCard
                label="Sold Products"
                value={stats.soldProducts}
                href="/admin/products?status=sold"
              />
              <StatCard
                label="Hidden Products"
                value={stats.hiddenProducts}
                href="/admin/products?status=hidden"
              />
              <StatCard
                label="Total Orders"
                value={stats.totalOrders}
                href="/admin/orders"
              />
              <StatCard
                label="Pending Orders"
                value={stats.pendingOrders}
                href="/admin/orders?status=pending"
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <section className="rounded-xl border border-border bg-card p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Recent Products</h2>
                  <Link
                    href="/admin/products"
                    className="text-sm text-primary hover:underline"
                  >
                    View all
                  </Link>
                </div>
                {stats.recentProducts.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No products yet.</p>
                ) : (
                  <ul className="divide-y divide-border">
                    {stats.recentProducts.map((product) => (
                      <li key={product._id}>
                        <Link
                          href={`/admin/products/${product._id}`}
                          className="flex items-center justify-between py-3 transition hover:text-primary"
                        >
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-xs text-muted-foreground capitalize">
                              {product.status}
                            </p>
                          </div>
                          <span className="text-sm font-medium">
                            {formatPrice(product.price)}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section className="rounded-xl border border-border bg-card p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Recent Orders</h2>
                  <Link
                    href="/admin/orders"
                    className="text-sm text-primary hover:underline"
                  >
                    View all
                  </Link>
                </div>
                {stats.recentOrders.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No orders yet.</p>
                ) : (
                  <ul className="divide-y divide-border">
                    {stats.recentOrders.map((order) => (
                      <li key={order._id}>
                        <Link
                          href={`/admin/orders/${order._id}`}
                          className="flex items-center justify-between py-3 transition hover:text-primary"
                        >
                          <div>
                            <p className="font-medium">{order.orderNumber}</p>
                            <p className="text-xs text-muted-foreground">
                              {order.customer.name}
                              {order.createdAt &&
                                ` · ${formatDate(order.createdAt)}`}
                            </p>
                          </div>
                          <span className="text-sm font-medium capitalize">
                            {order.status.replace(/_/g, " ")}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
