import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "AI SaaS",
  description: "AI Product Description Generator",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="min-h-screen flex flex-col bg-black text-white"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}