// web/postcss.config.cjs
// This file uses CommonJS module syntax with 'module.exports'.
// The .cjs extension indicates Node.js should treat it as a CommonJS module,
// which sometimes has better compatibility with Next.js's PostCSS loaders.

module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
