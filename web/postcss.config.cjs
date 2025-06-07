// web/postcss.config.cjs
// Este archivo utiliza sintaxis de módulos CommonJS con 'module.exports'.
// La extensión .cjs indica que Node.js debe tratarlo como un módulo CommonJS,
// lo cual a veces tiene mejor compatibilidad con los loaders de Next.js para PostCSS.

module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
