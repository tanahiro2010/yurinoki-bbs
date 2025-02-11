import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import Advertise from "@/components/ui/advertise";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "ゆりのきBBS",
    template: "%s / ゆりのきBBS"
  },
  description: "tanahiro2010によってつくられた掲示板サイトです",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`bg-gray-100`}
      >
        {children}

        <Toaster />
        <Advertise />
        <script src="//cdn.tailwindcss.com"></script>
      </body>
    </html>
  );
}
