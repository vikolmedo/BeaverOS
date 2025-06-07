// web/tailwind.config.ts
// Este archivo configura Tailwind CSS para tu proyecto Next.js.
// Define dónde buscar las clases de Tailwind y extiende el tema con la paleta de colores de BeaverOS.

import type { Config } from 'tailwindcss';

const config: Config = {
  // La sección 'content' es CRÍTICA. Le dice a Tailwind dónde buscar tus clases CSS.
  // Asegúrate de que estas rutas coincidan con la estructura de tu proyecto Next.js.
  // Para el App Router, las rutas comunes son 'src/pages', 'src/components', 'src/app'.
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}', // Esta es crucial para el App Router de Next.js
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      // Aquí definimos nuestros colores personalizados de la paleta institucional de BeaverOS
      colors: {
        beaverBlue: {
          DEFAULT: '#3B82F6', // blue-500
          light: '#60A5FA',   // blue-400
          dark: '#1E3A8A',    // blue-900 / blue-950 equivalent
        },
        beaverNeutral: {
          DEFAULT: '#6B7280',  // gray-500
          light: '#F3F4F6',    // gray-100
          dark: '#1F2937',     // gray-800
        },
        // Colores de estado
        success: '#10B981', // green-500
        warning: '#F59E0B', // yellow-500
        error: '#EF4444',   // red-500
      },
      fontFamily: {
        // Asumiendo que 'Inter' está configurada en layout.tsx o globales.
        // Si no usas una fuente personalizada, puedes omitir esta sección.
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [], // Puedes añadir plugins de Tailwind aquí en el futuro
};

export default config;
