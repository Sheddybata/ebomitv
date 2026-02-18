import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ProgramProvider } from "@/contexts/ProgramContext";
import Footer from "@/components/Footer";
import BottomNavigation from "@/components/BottomNavigation";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ebomi TV",
  description: "Watch live streams, sermons, and gospel content from EBOMI Ministries",
  icons: {
    icon: "/logo/ebomilogo.png",
    shortcut: "/logo/ebomilogo.png",
    apple: "/logo/ebomilogo.png",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Ebomi TV",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${playfair.variable} ${inter.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <ProgramProvider>
              {children}
              <Footer />
              <BottomNavigation />
            </ProgramProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}


