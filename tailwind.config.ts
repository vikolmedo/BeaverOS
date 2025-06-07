import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: { // Here we define our Color Palet
        beaverBlue: {
          DEFAULT: '#3B82F6', // blue-500
          light: '#B60A5FA',  // blue-400
          dark: '#1E3A8A',    // blue-900
        },
        beaverNeutral: {
          DEFAULT: '#6B7280', // gray-500
          light: '#F3F4F6',   // gray-100
          dark: '#1F2937',    // gray-800
        },
        // State colors
        success: '#10B981',   // green-500
        warning: '#F59E0B',   // yellow-500
        error: '#EF4444',     // red-500
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
