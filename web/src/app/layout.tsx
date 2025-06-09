// web/src/app/layout.tsx
import "./globals.css";
import { Inter } from "next/font/google";
import { AuthProvider } from "./contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "BeaverOS Admin Panel",
  description: "Admin panel for BeaverOS application.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* REMOVED: All script injection here */}
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
