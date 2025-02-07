import "./globals.css";

export const metadata = {
  title: 'Starglow Protocol',
  description: `Glow and Grow Together with Your Star!`,
  icons: {
    icon: '/favicon/favicon.ico',
  },
  
  openGraph: {
    title: 'Starglow Protocol',
    description: `Glow and Grow Together with Your Star!`,
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
    description: `Glow and Grow Together with Your Star!`,
    images: ['/images/link_image.webp'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
      </head>
      <body
        style={{
          backgroundColor: 'transparent'
        }}
      >
        {children}
      </body>
    </html>
  );
}