import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2026-07-08",
  css: ["~/assets/css/main.css"],
  devtools: { enabled: true },
  modules: [],
  ssr: true,
  typescript: {
    strict: true,
    typeCheck: true
  },
  vite: {
    plugins: [tailwindcss()]
  }
});

