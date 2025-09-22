import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "@/components/ui/sonner"
import "./globals.css";
import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

const inter = localFont({
  src: [
    {path:"./fonts/Inter/Inter.ttf", weight: "400", style:"normal"},
  ],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "DocChain",
  description: "A Blockchain-Supported Digitized Transcript of Records Managing System",
};

const RootLayout = async ({children}: {children: ReactNode}) => {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
        <body
          className={`${inter.className} ${inter.variable} antialiased`}
          suppressHydrationWarning
          >
            <SessionProvider session={session}>
              {children}
            </SessionProvider>    
          <Toaster richColors />

        </body>
    </html>
  );
}

export default RootLayout;
  