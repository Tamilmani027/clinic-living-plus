import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import '@fortawesome/fontawesome-free/css/all.min.css';


const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Clinic Living Plus | Clinical Outpatient Desk",
  description:
    "Streamlined scheduling, triage prioritization, and real-time patient encounter tracking for health practitioners.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full scroll-smooth`}>
      <body className="min-h-full flex flex-col bg-[var(--color-surface)] text-[var(--color-on-surface)]">
        {children}
      </body>
    </html>
  );
}
