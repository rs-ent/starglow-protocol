import "./globals.css";
import Providers from "./context/Providers";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Toaster } from "sonner";

export const metadata = {
  title: "Starglow Protocol",
  description: "Glow and Grow Together with Your Star!",
  icons: {
    // 라이트 모드: favicon-96x96.png 사용
    // 다크 모드: favicon.svg 사용 (또는 favicon.ico로 대체 가능)
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
    // 기본/대체 아이콘: shortcut (IE 등 일부 브라우저용)
    shortcut: "/favicon/favicon.ico",
    // Apple 전용: iPad, iPhone 등에서 사용됨
    apple: "/favicon/apple-touch-icon.png",
  },
  // 매니페스트 파일 지정 (iOS/Android에서 웹앱 설치시 사용)
  manifest: "/favicon/site.webmanifest",

  openGraph: {
    title: "Starglow Protocol",
    description: "Glow and Grow Together with Your Star!",
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
    description: "Glow and Grow Together with Your Star!",
    images: ["/images/link_image.webp"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
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
