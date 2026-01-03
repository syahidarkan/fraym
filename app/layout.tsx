import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Fraym - Professional Wireframing & Design Thinking Tool",
    template: "%s | Fraym"
  },
  description: "Create professional wireframes, diagrams, and design thinking workflows with ease. Drag-and-drop interface, 50+ UI components, and complete design thinking toolkit. Free to start.",
  keywords: ["wireframe", "wireframing tool", "design thinking", "UX design", "UI design", "prototyping", "diagram tool", "flowchart", "UML diagram", "BPMN", "user journey map", "empathy map"],
  authors: [{ name: "Fraym Team" }],
  creator: "Fraym",
  publisher: "Fraym",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  openGraph: {
    title: "Fraym - Professional Wireframing & Design Thinking Tool",
    description: "Create professional wireframes, diagrams, and design thinking workflows with ease. Free to start.",
    url: "/",
    siteName: "Fraym",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Fraym - Professional Design Tool"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Fraym - Professional Wireframing & Design Thinking Tool",
    description: "Create professional wireframes, diagrams, and design thinking workflows with ease. Free to start.",
    images: ["/og-image.png"],
    creator: "@fraym"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
// Trigger rebuild
