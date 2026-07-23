import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Piyush Goel | Voice Artist & Content Host",
  description:
    "Editorial portfolio for Piyush Goel, voice artist, UGC creator, and content host.",
  icons: {
    icon: [
      { url: "/icon.png", sizes: "any", type: "image/png" },
    ],
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full overflow-x-hidden">
      <head>
        <link rel="icon" href="/icon.png" sizes="any" />
        <link rel="shortcut icon" href="/icon.png" />
      </head>
      <body className="min-h-full overflow-x-hidden font-sans antialiased">{children}</body>
    </html>
  );
}
