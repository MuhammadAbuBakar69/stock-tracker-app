import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner"
import Script from 'next/script';
import "./globals.css";
import HydrationDebugger from '@/components/HydrationDebugger';
import Footer from '@/components/Footer';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Signalist",
  description: "Track real-time stock prices, get personalized alerts and explore detailed company insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Inline script to remove known extension-injected attributes that cause
            hydration mismatches (e.g. cz-shortcut-listen). Use Next's Script
            with beforeInteractive so it runs before React hydration. */}
        <Script
          id="remove-extension-attrs"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
          (function removeInjectedAttributes(){
            try {
              var doc = document;
              var nodes = [doc && doc.body, doc && doc.documentElement];

              // Known explicit attribute names to remove
              var known = ['cz-shortcut-listen', 'data-cke-paused'];

              // Helper to decide if an attribute looks like an injected one
              function shouldRemove(name){
                if (!name) return false;
                var n = name.toLowerCase();
                if (known.indexOf(n) !== -1) return true;
                // Attributes related to Grammarly / proofing extensions
                if (n.indexOf('gramm') !== -1) return true;
                if (n.indexOf('data-new-gr') === 0) return true;
                if (n.indexOf('data-gr') === 0) return true;
                // Some extensions prefix attributes with gr- or gr_ext
                if (n.indexOf('gr-') === 0) return true;
                if (n.indexOf('data-cke') === 0) return true;
                // cz-* shortcuts
                if (n.indexOf('cz-') === 0) return true;
                return false;
              }

              nodes.forEach(function(node){
                try {
                  if (!node || !node.attributes) return;
                  // Collect attribute names to remove (can't mutate while iterating attributes list)
                  var toRemove = [];
                  for (var i = 0; i < node.attributes.length; i++){
                    var nm = node.attributes[i].name;
                    if (shouldRemove(nm)) toRemove.push(nm);
                  }
                  toRemove.forEach(function(a){ try { node.removeAttribute(a); } catch(e){} });
                } catch(e) { }
              });
            } catch (e) { }
          })();
        `,
          }}
        />
        <HydrationDebugger />
        {/* JSON-LD for Search engines: describe this as a SoftwareApplication with a download URL.
            Search engines (including Google) may use this structured data to provide richer
            search result actions (e.g. a Download button). Note: Google decides whether to
            surface the action and it may take some time after the page is crawled/indexed.
        */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Signalist",
          "description": "Track real-time stock prices, get personalized alerts and explore detailed company insights.",
          "applicationCategory": "FinanceApplication",
          "operatingSystem": "Web",
          "url": "/",
          "downloadUrl": "/api/download",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          }
        }) }} />
        {children}
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
