import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import minip from "./vite-plugin-minip"

const configFile = "app.json";

export default defineConfig({
  plugins: [
    solidPlugin(),
    minip()
  ],
  server: {
    host: "0.0.0.0",
  },
  preview: {
    open: false,
  },
  build: {
    target: "esnext",
  },
  base: "",
});
