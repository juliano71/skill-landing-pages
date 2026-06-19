import "./globals.css";
import type { ReactNode } from "react";

export const metadata = { title: "Páginas Low Ticket" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-bg text-fg font-body">{children}</body>
    </html>
  );
}
