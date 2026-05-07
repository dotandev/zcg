import { Buffer } from 'buffer';
if (typeof window !== 'undefined') {
  window.Buffer = window.Buffer || Buffer;
}

import type { Metadata } from "next";
import "./globals.css";
import { SolanaWalletProvider } from "@/components/SolanaWalletProvider";
import { AppShell } from "@/components/AppShell";
import { ZcgProvider } from "@/context/ZcgContext";
import { ToastProvider } from "@/context/ToastContext";
import { ThemeProvider } from "@/context/ThemeContext";

export const metadata: Metadata = {
  title: "ZAYNAB | On-Chain Scholarly Consensus",
  description: "A decentralized protocol for academic assessment and reputation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SolanaWalletProvider>
          <ThemeProvider>
            <ToastProvider>
              <ZcgProvider>
                <AppShell>
                  {children}
                </AppShell>
              </ZcgProvider>
            </ToastProvider>
          </ThemeProvider>
        </SolanaWalletProvider>
      </body>
    </html>
  );
}
