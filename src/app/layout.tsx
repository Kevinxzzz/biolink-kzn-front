import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.scss";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kzngg.com"),
  title: "KZN",
  description: "Eleve seu nível no eFootball com contas premium equipadas com os melhores jogadores do meta. Compra 100% segura e entrega automatizada.",
  keywords: ["efootball", "contas efootball", "comprar conta efootball", "kzn"],
  authors: [{ name: "KZN" }],
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "KZN | Contas Premium de eFootball",
    description: "Eleve seu nível no eFootball com contas premium equipadas com os melhores jogadores do meta.",
    url: "https://kzngg.com",
    siteName: "KZN",
    images: [
      {
        url: "/logos/KZN-ROXO.png",
        width: 1200,
        height: 630,
        alt: "KZN",
      }
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KZN",
    description: "Eleve seu nível em jogos com contas premium equipadas com os melhores do meta.",
    images: ["/logos/KZN-ROXO.png"],
  },
  robots: {
    index: true,
    follow: true,
  }
};

import { QueryProvider } from "@/providers/QueryProvider";
import { ToastContainer } from "@/components/ui/Toast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={inter.variable} data-theme="dark">
      <body>
        <QueryProvider>
          {children}
          <ToastContainer position="top-right" />
        </QueryProvider>
      </body>
    </html>
  );
}
