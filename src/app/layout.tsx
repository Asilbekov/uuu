import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import "katex/dist/katex.min.css";
import { Toaster } from "@/components/ui/toaster";
import { SpeedInsights } from "@vercel/speed-insights/next";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ChemTest - Chemistry Test Platform",
  description: "Create, take, and track chemistry tests with randomized questions and answer variants.",
  keywords: ["chemistry", "test", "quiz", "education", "science"],
  authors: [{ name: "ChemTest" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${bricolage.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
        {/* Real-user Core Web Vitals (LCP / INP / CLS) → Vercel dashboard */}
        <SpeedInsights />
      </body>
    </html>
  );
}
