import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Digital Signature Builder",
  description: "Create and embed digital signatures in PDF documents with cryptographic security",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
