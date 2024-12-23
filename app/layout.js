import { Geist, Geist_Mono } from "next/font/google";
import localFont from 'next/font/local';
import "./globals.css";

const conthrax = localFont({
  src: '../public/fonts/conthrax-sb.ttf',
  variable: '--font-conthrax',
  display: 'swap',
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: 'Starglow Protocol',
  description: `"Glow and Grow Together with Your Star" 
RWA the Entertainment Industry 
Curation daily music and artist 
Engage to Earn TG Mini-App`,
  icons: {
    icon: '/favicon.ico',
  },
  
  openGraph: {
    title: 'Starglow Protocol',
    description: `"Glow and Grow Together with Your Star" 
RWA the Entertainment Industry 
Curation daily music and artist 
Engage to Earn TG Mini-App`,
    images: [
      {
        url: '/images/link_image.webp',
        width: 1200,
        height: 630,
      },
    ],
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Starglow Protocol',
    description: `"Glow and Grow Together with Your Star" 
RWA the Entertainment Industry 
Curation daily music and artist 
Engage to Earn TG Mini-App`,
    images: ['/images/link_image.webp'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${conthrax.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
