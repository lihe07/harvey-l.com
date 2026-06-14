import UnoCSS from "@unocss/postcss";

// UnoCSS's Vite plugin can't hook Vite 8's rolldown CSS pipeline (it looks for
// the old `vite:css-post` plugin and silently emits nothing). The PostCSS
// integration is independent of Vite internals, so styles survive the upgrade.
export default {
  plugins: [UnoCSS()],
};
