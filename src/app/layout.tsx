import type { Metadata } from "next";
import {
  Atkinson_Hyperlegible,
  Lexend,
  Fraunces,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";
import { SensoryProvider } from "@/components/SensoryProvider";
import { CustomCursor } from "@/components/CustomCursor";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const atkinson = Atkinson_Hyperlegible({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-atkinson",
});

const lexend = Lexend({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-lexend",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-fraunces",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: {
    default: "Vivências Superdotadas — Acolhimento, Ciência e Voz em Primeira Pessoa",
    template: "%s · Vivências Superdotadas",
  },
  description:
    "Associação dedicada a reconhecer e acolher pessoas com Altas Habilidades/Superdotação (AH/SD) e neurodivergências sem romantização, sem patologização e sem exclusivismo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${atkinson.variable} ${lexend.variable} ${fraunces.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col">
        <SensoryProvider>
          <CustomCursor />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </SensoryProvider>
      </body>
    </html>
  );
}
