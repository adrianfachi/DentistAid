import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const interSans = Inter({
  variable: "--font-Inter-sans",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Dra. Natália Rossoni",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <head>
        <link rel="shortcut icon" href="logo.svg" type="image/x-icon" />
      </head>
      <body
        className={`${interSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
