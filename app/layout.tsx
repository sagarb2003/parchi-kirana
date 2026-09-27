import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ParchiProvider } from "@/lib/store";
import { Toaster } from "@/components/ui";
import { DemoSwitcher } from "@/components/demo-switcher";

const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Parchi — Your list. Their prep. Zero waiting.",
  description: "Send your grocery list to your local kirana store, let them prepare it, and skip the queue when you arrive.",
};

export const viewport: Viewport = { themeColor: "#158151" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${jakarta.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">
        <ParchiProvider>
          {children}
          <DemoSwitcher />
          <Toaster />
        </ParchiProvider>
      </body>
    </html>
  );
}
