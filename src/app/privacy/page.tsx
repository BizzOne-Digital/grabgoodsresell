import { getSiteSettings } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Grab My Goods Resell.",
};

export default async function PrivacyPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <section className="border-b border-border bg-muted/30">
        <div className="container-page py-12 sm:py-16">
          <h1 className="font-display text-4xl font-semibold sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Last updated: August 2026
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-page">
          <div className="prose prose-sm mx-auto max-w-3xl text-muted-foreground">
            <p className="text-base leading-relaxed">
              This privacy policy describes how {settings.businessName} (&quot;we,&quot;
              &quot;us,&quot; or &quot;our&quot;) collects, uses, and protects your personal
              information when you use our website and services.
            </p>

            <h2 className="mt-10 font-display text-xl font-semibold text-foreground">
              Information We Collect
            </h2>
            <p className="mt-4 leading-relaxed">
              When you place an order, contact us, or browse our site, we may collect
              information such as your name, email address, phone number, order details,
              and messages you send us. We may also collect basic usage data through
              standard web technologies.
            </p>

            <h2 className="mt-10 font-display text-xl font-semibold text-foreground">
              How We Use Your Information
            </h2>
            <p className="mt-4 leading-relaxed">
              We use your information to process orders, confirm availability, arrange
              local pickup, respond to inquiries, and improve our services. We do not
              sell your personal information to third parties.
            </p>

            <h2 className="mt-10 font-display text-xl font-semibold text-foreground">
              Data Storage & Security
            </h2>
            <p className="mt-4 leading-relaxed">
              We take reasonable measures to protect your information. Order and contact
              data is stored securely and accessed only as needed to fulfill your request.
            </p>

            <h2 className="mt-10 font-display text-xl font-semibold text-foreground">
              Contact Us
            </h2>
            <p className="mt-4 leading-relaxed">
              If you have questions about this privacy policy or your data, please contact
              us at{" "}
              <a
                href={`mailto:${settings.email}`}
                className="text-primary transition hover:underline"
              >
                {settings.email}
              </a>{" "}
              or call {settings.phone}.
            </p>

            <p className="mt-10 rounded-2xl border border-border bg-muted/30 p-5 text-sm">
              This is a placeholder privacy policy and should be reviewed and updated
              with legal counsel before production use.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
