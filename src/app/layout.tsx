import type { Metadata } from "next"
import "./globals.css"
import { Providers } from "@/providers"

export const metadata: Metadata = {
  title: {
    default: "SKYNET - Portal Académico",
    template: "%s | SKYNET",
  },
  description: "Portal académico del equipo SKYNET — investigación e innovación en Inteligencia Artificial y Tecnología.",
  keywords: ["SKYNET", "inteligencia artificial", "investigación", "maestría", "tecnología"],
  authors: [{ name: "Equipo SKYNET" }],
  openGraph: {
    type: "website",
    locale: "es_MX",
    siteName: "SKYNET",
    title: "SKYNET - Portal Académico",
    description: "Innovando el futuro con Inteligencia Artificial.",
  },
  twitter: {
    card: "summary_large_image",
    title: "SKYNET - Portal Académico",
    description: "Innovando el futuro con Inteligencia Artificial.",
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}