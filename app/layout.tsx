// layout.tsx
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { AuthContextProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "./components/Providers";
import store from "./redux/store/store";
import { SearchProvider } from "./context/SearchContext";
import { ThemeProvider } from "./components/ThemeProvider";

export const metadata: Metadata = {
  title: "GGVMart — Second Hand Marketplace",
  description:
    "Buy and sell second-hand items at GGV. The trusted campus marketplace.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <AuthContextProvider>
        <Providers>
          <SearchProvider>
            <ThemeProvider>
              <body className="font-sans">
                <Navbar />
                <Toaster />
                <main>{children}</main>
              </body>
            </ThemeProvider>
          </SearchProvider>
        </Providers>
      </AuthContextProvider>
    </html>
  );
}
