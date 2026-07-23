import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Piyush Goel | Voice Artist & Content Host",
  description:
    "Editorial portfolio for Piyush Goel, voice artist, UGC creator, and content host.",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full font-sans antialiased">{children}</body>
    </html>
  );
}
