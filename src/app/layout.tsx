import type { Metadata } from "next";
import "@/styles/globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Mariage de Radene & Kevin | 20 Juin 2026",
  description:
    "Célébrez l'union de Radene & Kevin le 20 Juin 2026 au Château Saint-Georges à Grasse. Confirmez votre présence, découvrez le programme et partagez vos vœux.",
  keywords: ["Mariage", "Radene et Kevin", "RSVP Mariage", "Château Saint-Georges", "Grasse"],
  authors: [{ name: "Radene & Kevin" }],
  openGraph: {
    title: "Mariage de Radene & Kevin | 20 Juin 2026",
    description: "Rejoignez-nous pour célébrer notre union au Château Saint-Georges.",
    type: "website",
    locale: "fr_FR",
    images: [
      {
        url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Mariage Radene & Kevin",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-gold-200 selection:text-gold-900">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
