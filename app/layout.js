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
  title: "Starglow Protocol",
  description: "Starglow Protocol",
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
