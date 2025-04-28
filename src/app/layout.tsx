import type { Metadata } from "next";
import { SolanaProvider } from '@/components/Solana/SolanaProvider';
import "./globals.css";


export const metadata: Metadata = {
  title: "OnChainCv",
  description: "The résumé of the future—with on-chain verified skills, experience, and achievements.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
      <SolanaProvider>
        {children}
        </SolanaProvider>
      </body>
    </html>
  );
}
