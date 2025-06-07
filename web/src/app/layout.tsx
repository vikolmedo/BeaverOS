// clients/admin-web-panel/src/app/layout.tsx
// NOTA: La ruta real del archivo es web/src/app/layout.tsx después de la consolidación.
import './globals.css';
import { Inter } from 'next/font/google'; // Importamos Inter de Google Fonts

const inter = Inter({ subsets: ['latin'] }); // Configuramos la fuente Inter

export const metadata = {
  title: 'BeaverOS Admin Panel',
  description: 'Admin panel for BeaverOS - Product and Inventory Management',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* Aplicamos la clase de la fuente Inter al body */}
      <body className={inter.className}>{children}</body>
    </html>
  );
}
