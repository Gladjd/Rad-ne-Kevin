import type { Metadata } from "next";
import "@/styles/globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://radene-kevin.com"),
  title: "Mariage de Radène & Kévin | 5 Décembre 2026 • Pureté, Amour & Charité",
  description:
    "Célébrez le sacrement de mariage de Radène & Kévin le Samedi 5 Décembre 2026 à l'Eglise Protestante du Sénégal, Paroisse de Dieuppeul, Dakar, et la soirée de gala à la salle Fun Time. Confirmez votre présence (RSVP), découvrez le programme et partagez vos vœux.",
  keywords: ["Mariage", "Radène et Kévin", "RSVP Mariage", "Eglise Protestante Dieuppeul", "Fun Time", "Dakar", "Pureté Amour Charité"],
  authors: [{ name: "Radène & Kévin" }],
  openGraph: {
    title: "Mariage de Radène & Kévin | 5 & 6 Décembre 2026",
    description: "Rejoignez-nous pour célébrer notre union sacrée à l'Eglise Protestante du Sénégal (Dieuppeul) et à la salle de fête Fun Time à Dakar.",
    type: "website",
    locale: "fr_FR",
    images: [
      {
        url: "/img/couple-16.jpg",
        width: 1200,
        height: 630,
        alt: "Mariage Radène & Kévin",
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
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-gold-200 selection:text-royal-900">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
