import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/app/providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ecopomac.vercel.app"),
  title: {
    default: "EcoPómac",
    template: "%s · EcoPómac",
  },
  description:
    "Plataforma educativa e interactiva sobre la deforestación y conservación del Santuario Histórico Bosque de Pómac (Lambayeque, Perú).",
  applicationName: "EcoPómac",
  keywords: [
    "Bosque de Pómac",
    "deforestación",
    "conservación",
    "ecología",
    "Lambayeque",
    "Perú",
    "educación ambiental",
  ],
  openGraph: {
    title: "EcoPómac",
    description:
      "Tecnología al servicio de la conservación del Bosque de Pómac. Simulador, mapa, juego educativo, huella ecológica y panel estadístico.",
    type: "website",
    locale: "es_PE",
    siteName: "EcoPómac",
  },
  twitter: {
    card: "summary_large_image",
    title: "EcoPómac",
    description:
      "Tecnología al servicio de la conservación del Bosque de Pómac.",
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icons/icon.svg",
    apple: "/icons/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-emerald-200/60 selection:text-emerald-950 dark:selection:bg-emerald-300/30 dark:selection:text-emerald-50">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
