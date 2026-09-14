import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "../context/StoreContext";
import { CartProvider } from "../context/CartContext";
import { WishlistProvider } from "../context/WishlistContext";
import { AnnouncementBar } from "../components/layout/AnnouncementBar";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { WhatsAppButton } from "../components/layout/WhatsAppButton";
import { CartDrawer } from "../components/cart/CartDrawer";
import { ProductQuickView } from "../components/products/ProductQuickView";
import { TrackOrderModal } from "../components/orders/TrackOrderModal";

export const metadata: Metadata = {
  title: "Luqman Fabrics | Quality You Feel, Style You Love | Pakistan Fabric Boutique",
  description: "Shop luxury unstitched Pakistani fabrics at Luqman Fabrics. Authentic Swiss Lawn, Men's Royal Boski, Japanese Wash & Wear, Embroidered Chiffon, Pure Cotton & Winter Karandi. Nationwide Cash on Delivery & Direct WhatsApp Orders (+92 340 9797271).",
  keywords: "Luqman Fabrics, Shewa, Pakistan, Boski, Swiss Lawn, Unstitched Fabric, Men Wash and Wear, Chiffon Embroidered, Pure Cotton, WhatsApp Fabric Store",
  openGraph: {
    title: "Luqman Fabrics | Luxury Pakistani Textiles & Unstitched Suits",
    description: "Quality You Feel, Style You Love. Order with direct WhatsApp confirmation +92 340 9797271.",
    type: "website",
    locale: "en_PK",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-white text-neutral-900 antialiased selection:bg-gold-100 selection:text-gold-900">
        <StoreProvider>
          <WishlistProvider>
            <CartProvider>
              {/* Top Announcement Bar */}
              <AnnouncementBar />

              {/* Main Sticky Glassmorphism Header */}
              <Navbar />

              {/* Page Body */}
              <main className="flex-1">{children}</main>

              {/* Luxury Footer */}
              <Footer />

              {/* Floating Widgets & Overlays */}
              <WhatsAppButton />
              <CartDrawer />
              <ProductQuickView />
              <TrackOrderModal />
            </CartProvider>
          </WishlistProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
