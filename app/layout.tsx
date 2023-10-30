import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import ClientProviders from "@/app/ClientProviders";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

const nextFont = Quicksand({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "V2ray servers manager",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <body className={`${nextFont.className} dark`}>
        <ClientProviders session={session}>{children}</ClientProviders>
        <Toaster />
      </body>
    </html>
  );
}
