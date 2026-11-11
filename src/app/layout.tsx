import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HOÀNG THÀNH CRM",
  description: "CRM điều hành xe điện Hoàng Thành — Đại Nội Huế"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
