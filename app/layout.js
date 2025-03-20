import "./globals.css";
import Providers from "./context/Providers";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Toaster } from "sonner";

export const metadata = {
  title: "Starglow Protocol",
  description: `✨ Glow and Grow Together with Your Star! 🌟 Artist Management + RWA DeFi 🚀  
Starglow Protocol is a DAO for KPOP NFTs, DeFi, and Real-World Assets (RWA) 🌐🎶`,
  keywords: [
    "starglow", "crypto", "NFT", "blockchain", "investment", "web3",
    "rwa", "defi", "dao", "kpop", "kpopnft", "kpopdao",
    "kpopdefi", "kpoprwa", "kpopweb3", "kpopblockchain",
    "kpopcrypto", "kpopinvestment", "kpopstarglow",
    "kpopstarglowprotocol", "kpopstarglowprotocol.com"
  ],
  authors: [{ name: "Starglow Team", url: "https://starglow.io" }],
  icons: {
    icon: [
      {
        url: "/favicon/icon.png",
        media: "(prefers-color-scheme: light)",
        sizes: "96x96",
        type: "image/png",
      },
      {
        url: "/favicon/icon.svg",
        media: "(prefers-color-scheme: dark)",
        type: "image/svg+xml",
      },
    ],
    shortcut: "/favicon/favicon.ico",
    apple: "/favicon/apple-icon.png",
  },
  openGraph: {
    title: "Starglow Protocol",
    description: `✨ Glow and Grow Together with Your Star! 🌟 Artist Management + RWA DeFi 🚀  
Starglow Protocol is a DAO for KPOP NFTs, DeFi, and Real-World Assets (RWA) 🌐🎶`,
    siteName: "Starglow Protocol",
    url: "https://starglow.io",
    images: [
      {
        url: "/images/link_image.webp",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Starglow Protocol",
    description: `✨ Glow and Grow Together with Your Star! 🌟 Artist Management + RWA DeFi 🚀  
Starglow Protocol is a DAO for KPOP NFTs, DeFi, and Real-World Assets (RWA) 🌐🎶`,
    images: ["/images/link_image.webp"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  themeColor: "#6d28d9",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Naver Search Console Verification */}
        <meta name="naver-site-verification" content="3e549105be83fb6b6c1ef82fbe9338d1965c5b6e" />

        {/* Google Tag Manager Script */}
        <Script id="gtm-script" strategy="afterInteractive">
          {`
          (function(w,d,s,l,i){
            w[l]=w[l]||[];
            w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
            var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s), dl=l!='dataLayer'?'&l='+l:'';
            j.async=true;
            j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
            f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-M4F29G36');
          `}
        </Script>
      </head>
      <body
        style={{
          backgroundColor: "transparent",
        }}
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-M4F29G36"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        <Providers>
          <Toaster position="top-right" />
          {children}
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
