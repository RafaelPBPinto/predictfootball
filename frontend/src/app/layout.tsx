import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/components/providers/query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";

export const metadata: Metadata = {
  title: "PredictFootball",
  description: "Football results, standings and statistics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme');if(t==='light')document.documentElement.classList.remove('dark');else document.documentElement.classList.add('dark')})()`,
          }}
        />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          <QueryProvider>
            <Navbar />
            <div className="flex min-h-[calc(100vh-3.5rem)]">
              <Sidebar />
              <main className="flex-1 px-4 py-6">
                <div className="mx-auto max-w-5xl">{children}</div>
              </main>
            </div>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
