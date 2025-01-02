// layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthContextProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar"; // Adjust the import path based on your project structure
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "./components/Providers";
import store from "./redux/store/store";
import { SearchProvider } from "./context/SearchContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GGV Mart",
  description: "Second Hand MarketPlace for GGV.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthContextProvider>
        <Providers>
          <SearchProvider>
            <body className={inter.className}>
              <Navbar /> {/* Include the Navbar here */}
              <Toaster />
              {children}
            </body>
          </SearchProvider>
        </Providers>
      </AuthContextProvider>
    </html>
  );
}
