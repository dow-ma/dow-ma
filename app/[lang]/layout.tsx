import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "@/app/globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata({ params }: { params: Promise<{ lang: "en" | "zh" }> }): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: "Dow Ma",
    description: lang === "zh" ? "Dow Ma 的个人主页与文章。" : "Personal profile and writings of Dow Ma.",
  };
}

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "zh" }];
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;

  return (
    <html lang={lang} suppressHydrationWarning>
      <body className={`${outfit.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

