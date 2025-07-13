import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ['400', '600', '700'] 
});

export const metadata: Metadata = {
  title: "Coin",
  description: "A coin flip and D20 roll app.",
  manifest: "/manifest.ts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={poppins.className}>{children}</body>
    </html>
  );
}
