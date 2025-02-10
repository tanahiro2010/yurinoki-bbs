import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import "@/styles/globals.css";
export const runtime = 'edge';

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
        <script src="//cdn.tailwindcss.com"></script>
      </body>
    </html>
  );
}
