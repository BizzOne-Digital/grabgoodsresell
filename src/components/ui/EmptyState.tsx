import { cn } from "@/lib/utils";
import { AlertCircle, Package, ShoppingBag } from "lucide-react";

interface EmptyStateProps {
  icon?: "cart" | "products" | "generic";
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

const icons = {
  cart: ShoppingBag,
  products: Package,
  generic: AlertCircle,
};

export function EmptyState({
  icon = "generic",
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  const Icon = icons[icon];

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center",
        className,
      )}
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted text-primary">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="font-display text-xl font-semibold">{title}</h3>
      {description && (
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function LoadingState({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex min-h-[200px] items-center justify-center">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        {message}
      </div>
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  description = "Please try again in a moment.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <EmptyState
      icon="generic"
      title={title}
      description={description}
    />
  );
}
