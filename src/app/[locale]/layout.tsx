import type { Metadata } from "next";
import {NextIntlClientProvider} from 'next-intl';

import localFont from "next/font/local";
import "./globals.css";
import Image from "next/image";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900"
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900"
});

export const metadata: Metadata = {
  title: "Canticum Bibliothecam",
  description: "",
  icons: ["/bible.svg"]
};

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}>) {
  const {locale} = await params;

  return (
    <html lang={locale}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <NextIntlClientProvider>
        <SidebarProvider defaultOpen={true}>
          <AppSidebar />
          <SidebarTrigger />
          <div className="flex h-[100%] w-[100%] flex-col items-center pr-12">
            <nav>
              <div className="flex flex-col items-center justify-center">
                <p className="flex items-center justify-center gap-2 p-4 text-4xl">
                  Canticum Bibliothecam
                </p>
                <Image
                  className="dark:invert"
                  src="/bible.svg"
                  alt="Canticum Bibliothecam logo"
                  width={60}
                  height={60}
                />
              </div>
            </nav>
            {children}
          </div>
        </SidebarProvider>
        <Toaster />
      </NextIntlClientProvider>
      </body>
    </html>
  );
}
