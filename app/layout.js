import "./globals.css";

export const metadata = {
  title: 'Starglow Protocol',
  description: 'Glow and Grow Together with Your Star!',
  icons: {
    // 라이트 모드: favicon-96x96.png 사용
    // 다크 모드: favicon.svg 사용 (또는 favicon.ico로 대체 가능)
    icon: [
      {
        url: '/favicon/favicon-96x96.png',
        media: '(prefers-color-scheme: light)',
        sizes: '96x96',
        type: 'image/png',
      },
      {
        url: '/favicon/favicon.svg',
        media: '(prefers-color-scheme: dark)',
        type: 'image/svg+xml',
      },
    ],
    // 기본/대체 아이콘: shortcut (IE 등 일부 브라우저용)
    shortcut: '/favicon/favicon.ico',
    // Apple 전용: iPad, iPhone 등에서 사용됨
    apple: '/favicon/apple-touch-icon.png',
  },
  // 매니페스트 파일 지정 (iOS/Android에서 웹앱 설치시 사용)
  manifest: '/favicon/site.webmanifest',

  // 테마 컬러 (브라우저 UI 등에서 사용)
  themeColor: '#131313',

  openGraph: {
    title: 'Starglow Protocol',
    description: 'Glow and Grow Together with Your Star!',
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
    description: 'Glow and Grow Together with Your Star!',
    images: ['/images/link_image.webp'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
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