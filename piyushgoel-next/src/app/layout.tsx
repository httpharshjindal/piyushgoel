import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Piyush Goel | Voice Artist & Content Host",
  description:
    "Editorial portfolio for Piyush Goel, voice artist, UGC creator, and content host.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full overflow-x-hidden">
      <body className="min-h-full overflow-x-hidden font-sans antialiased">{children}</body>
    </html>
  );
}
