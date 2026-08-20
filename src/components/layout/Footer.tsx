import { BUSINESS_INFO } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { SiteSettingsData } from "@/types";
import {
  Clock,
  Globe,
  Mail,
  MapPin,
  Phone,
  Share2,
} from "lucide-react";
import Link from "next/link";

const FOOTER_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/booking", label: "Booking" },
  { href: "/faq", label: "FAQ" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/pricing", label: "Pricing" },
] as const;

interface FooterProps {
  settings?: Partial<SiteSettingsData>;
  className?: string;
}

export function Footer({ settings, className }: FooterProps) {
  const businessName = settings?.businessName ?? BUSINESS_INFO.name;
  const tagline = settings?.tagline ?? BUSINESS_INFO.tagline;
  const phone = settings?.phone ?? BUSINESS_INFO.phone;
  const email = settings?.email ?? BUSINESS_INFO.email;
  const footerText =
    settings?.footerText ??
    "Local pickup in Waxahachie, Texas. Fair prices, friendly service, and constantly changing inventory.";
  const copyright =
    settings?.copyright ?? `© ${businessName}. All rights reserved.`;
  const pickupInfo =
    settings?.pickupInfo ??
    "Local pickup only. Pickup details will be shared after your order is confirmed.";
  const businessHours =
    settings?.businessHours ?? "By appointment — contact us to schedule pickup.";

  const socialLinks = [
    ...(settings?.facebook
      ? [{ label: "Facebook", url: settings.facebook, icon: "facebook" as const }]
      : BUSINESS_INFO.facebook
        ? [{ label: "Facebook", url: BUSINESS_INFO.facebook, icon: "facebook" as const }]
        : []),
    ...(settings?.instagram
      ? [{ label: "Instagram", url: settings.instagram, icon: "instagram" as const }]
      : []),
    ...(settings?.socialLinks ?? []),
  ];

  return (
    <footer className={cn("border-t border-border bg-muted/40", className)}>
      <div className="container-page section-padding pb-10 pt-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <h2 className="font-display text-xl font-semibold">{businessName}</h2>
            </Link>
            <p className="text-sm text-muted-foreground">{tagline}</p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {footerText}
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wide text-foreground">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-muted-foreground transition hover:text-primary"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wide text-foreground">
              Contact
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{BUSINESS_INFO.location}</span>
              </li>
              <li>
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-3 transition hover:text-primary"
                >
                  <Phone className="h-4 w-4 shrink-0 text-primary" />
                  {phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-3 transition hover:text-primary"
                >
                  <Mail className="h-4 w-4 shrink-0 text-primary" />
                  {email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{businessHours}</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wide text-foreground">
              Follow Us
            </h3>
            {socialLinks.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition hover:border-primary hover:text-primary"
                    aria-label={link.label}
                  >
                    {"icon" in link && link.icon === "facebook" ? (
                      <Globe className="h-4 w-4" />
                    ) : "icon" in link && link.icon === "instagram" ? (
                      <Share2 className="h-4 w-4" />
                    ) : (
                      <span className="text-xs font-semibold">
                        {link.label.charAt(0)}
                      </span>
                    )}
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Connect with us on social media for the latest finds.
              </p>
            )}

            <div className="mt-6 rounded-2xl border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                Pickup Note
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {pickupInfo}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          {copyright}
        </div>
      </div>
    </footer>
  );
}
