import type { Metadata } from "next";
import "./globals.css";
import { ClientRoot } from "./ClientRoot";

export const metadata: Metadata = {
  title: "eFood — Ресторан",
  description: "Меню, бронь столика, заказ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        <ClientRoot>{children}</ClientRoot>
      </body>
    </html>
  );
}
