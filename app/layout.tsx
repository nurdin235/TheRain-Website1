import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://therain.tech"),
  applicationName: "TheRain",
  title: {
    default: "TheRain | Official Transport Platform in Cameroon",
    template: "%s"
  },
  description:
    "TheRain is Cameroon’s leading transport platform for ride-hailing, delivery, school transport, fleet services, and safer mobility.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/images/favicon.png", sizes: "64x64", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" }
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "300x300", type: "image/png" }
    ]
  },
  openGraph: {
    siteName: "TheRain",
    images: [{ url: "/images/bg.jpg", width: 1200, height: 630 }]
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#060E1F"
};

// Apply saved theme/lang before first paint to avoid flash
const themeScript = `try{var t=localStorage.getItem('therain_theme')||'dark';document.documentElement.setAttribute('data-theme',t);var l=localStorage.getItem('therain_lang')||'en';document.documentElement.setAttribute('data-lang',l);}catch(_){}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="dark" data-lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
