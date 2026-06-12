import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Server Portal",
  description: "Modern Server Management Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} text-slate-200 min-h-screen flex selection:bg-emerald-500/30 font-sans antialiased`}>
        <Providers>
          <Sidebar />
          <main className="flex-1 p-8 md:p-12 overflow-y-auto">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
