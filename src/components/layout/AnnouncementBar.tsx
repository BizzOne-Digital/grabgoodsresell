"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface AnnouncementBarProps {
  text: string;
  link?: string;
  dismissible?: boolean;
  storageKey?: string;
  className?: string;
}

export function AnnouncementBar({
  text,
  link,
  dismissible = true,
  storageKey = "gmg_announcement_dismissed",
  className,
}: AnnouncementBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!dismissible) {
      setVisible(true);
      return;
    }

    try {
      setVisible(localStorage.getItem(storageKey) !== "true");
    } catch {
      setVisible(true);
    }
  }, [dismissible, storageKey]);

  const handleDismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(storageKey, "true");
    } catch {
      // ignore storage errors
    }
  };

  if (!text || !visible) {
    return null;
  }

  const content = <span className="text-sm font-medium">{text}</span>;

  return (
    <div
      role="region"
      aria-label="Announcement"
      className={cn(
        "relative bg-primary text-primary-foreground",
        className,
      )}
    >
      <div className="container-page flex items-center justify-center gap-3 py-2.5 pr-10 text-center sm:pr-12">
        {link ? (
          <Link
            href={link}
            className="transition hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-foreground"
          >
            {content}
          </Link>
        ) : (
          content
        )}

        {dismissible && (
          <button
            type="button"
            onClick={handleDismiss}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 transition hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-foreground"
            aria-label="Dismiss announcement"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
