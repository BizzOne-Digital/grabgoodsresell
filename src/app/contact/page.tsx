import { ContactForm } from "@/app/contact/ContactForm";
import { getPageContent, getSiteSettings } from "@/lib/data";
import { BUSINESS_INFO } from "@/lib/constants";
import { defaultContactContent } from "@/lib/default-content";
import { Clock, Globe, Mail, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getPageContent("contact");
  const seo = pageData.seo as { title?: string; description?: string };

  return {
    title: seo?.title || "Contact",
    description:
      seo?.description ||
      "Get in touch with Grab My Goods Resell — questions about items, pickup scheduling, and more.",
  };
}

export default async function ContactPage() {
  const [pageData, settings] = await Promise.all([
    getPageContent("contact"),
    getSiteSettings(),
  ]);

  const content = {
    ...defaultContactContent,
    ...(pageData.content as typeof defaultContactContent),
  };

  const phone = settings.phone || BUSINESS_INFO.phone;
  const email = settings.email || BUSINESS_INFO.email;
  const facebook = settings.facebook || BUSINESS_INFO.facebook;

  return (
    <>
      <section className="border-b border-border bg-gradient-to-br from-background via-card to-muted/40">
        <div className="container-page py-16 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Get in Touch
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">
            {content.hero.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            {content.hero.subtitle}
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-page">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
            <div>
              <p className="leading-relaxed text-muted-foreground">
                {content.intro}
              </p>

              <ul className="mt-8 space-y-5">
                <li className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-semibold">Location</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {BUSINESS_INFO.location}
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-semibold">Phone</p>
                    <a
                      href={`tel:${phone.replace(/\s/g, "")}`}
                      className="mt-1 block text-sm text-muted-foreground transition hover:text-primary"
                    >
                      {phone}
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-semibold">Email</p>
                    <a
                      href={`mailto:${email}`}
                      className="mt-1 block text-sm text-muted-foreground transition hover:text-primary"
                    >
                      {email}
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5">
                  <Clock className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-semibold">Hours</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {settings.businessHours}
                    </p>
                  </div>
                </li>

                {facebook && (
                  <li className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5">
                    <Globe className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <div>
                      <p className="font-semibold">Facebook</p>
                      <a
                        href={facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 block text-sm text-muted-foreground transition hover:text-primary"
                      >
                        Follow us for new finds
                      </a>
                    </div>
                  </li>
                )}
              </ul>

              <div className="mt-8 rounded-2xl border border-border bg-muted/30 p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  Pickup Note
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {content.pickupNote}
                </p>
              </div>
            </div>

            <ContactForm formTitle={content.formTitle} />
          </div>
        </div>
      </section>
    </>
  );
}
