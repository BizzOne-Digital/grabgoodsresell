import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CartProvider } from "@/contexts/CartContext";
import { getSiteSettings } from "@/lib/data";
import type { Metadata } from "next";
import "./globals.css";

function getThemeCss(settings: {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}) {
  return `:root{--primary:${settings.primaryColor};--secondary:${settings.secondaryColor};--accent:${settings.accentColor};}`;
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: {
      default: settings.seo.title,
      template: `%s | ${settings.businessName}`,
    },
    description: settings.seo.description,
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const settings = await getSiteSettings();

  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <style
          dangerouslySetInnerHTML={{ __html: getThemeCss(settings) }}
        />
      </head>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <CartProvider>
          {settings.announcementBar?.enabled && settings.announcementBar.text && (
            <AnnouncementBar
              text={settings.announcementBar.text}
              link={settings.announcementBar.link}
            />
          )}
          <Header
            businessName={settings.businessName}
            tagline={settings.tagline}
          />
          <main className="flex-1">{children}</main>
          <Footer settings={settings} />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
