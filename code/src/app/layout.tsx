import type { Metadata } from "next";
import { Inter } from "next/font/google";
// import "@/app/globals.css"; // Ensure your global CSS is linked

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CoderPad Clone",
  description: "Real-time collaborative interview platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* This is where your pages (children) will render */}
        <main>{children}</main>
      </body>
    </html>
  );
}