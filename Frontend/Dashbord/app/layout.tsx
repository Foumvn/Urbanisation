import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "DP-Auto — Déclaration Préalable automatisée par IA",
  description:
    "Générez vos dossiers de déclaration préalable (DP) en urbanisme grâce à l'intelligence artificielle. Formulaires CERFA, plans (DP1, DP2, DP3…), notice descriptive et dépôt numérique, en quelques clics.",
  keywords: [
    "déclaration préalable",
    "urbanisme",
    "CERFA",
    "plans DP1 DP2",
    "permis construire",
    "automatisation IA",
    "France",
  ],
  authors: [{ name: "CS Technologie Builder" }],
  generator: "DP-Auto",
  openGraph: {
    title: "DP-Auto — Déclaration Préalable automatisée par IA",
    description: "Générez vos dossiers de déclaration préalable (DP) en urbanisme grâce à l'intelligence artificielle.",
    type: "website",
    locale: "fr_FR",
    siteName: "DP-Auto",
  },
  twitter: {
    card: "summary_large_image",
    title: "DP-Auto — Déclaration Préalable automatisée par IA",
    description: "Automatisation des déclarations préalables d'urbanisme avec IA.",
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className="dark">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense>
          {children}
          <Analytics />
        </Suspense>
      </body>
    </html>
  )
}
