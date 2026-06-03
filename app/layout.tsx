import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trust Panel for Claude",
  description: "Evaluate AI outputs with confidence",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-zinc-900 text-zinc-100 antialiased">{children}</body>
    </html>
  );
}
