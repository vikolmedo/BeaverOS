// web/tailwind.config.ts
// This file configures Tailwind CSS for your Next.js project.
// It defines where to look for Tailwind classes and extends the theme with the BeaverOS color palette.

import type { Config } from 'tailwindcss';

const config: Config = {
  // The 'content' section is CRITICAL. It tells Tailwind where to look for your CSS classes.
  // Ensure these paths match your Next.js project structure.
  // For the App Router, common paths are 'src/pages', 'src/components', 'src/app'.
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}', // This is crucial for Next.js App Router
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: { // Here we define our custom institutional BeaverOS colors
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
        // State colors (optional)
        success: '#10B981', // green-500
        warning: '#F59E0B', // yellow-500
        error: '#EF4444',   // red-500
      },
      fontFamily: { // If we want to use Inter or any other custom font
        sans: ['Inter', 'sans-serif'], // Assuming Inter is configured in layout.tsx or global styles
      },
    },
  },
  plugins: [], // You can add Tailwind plugins here in the future
};

export default config;
