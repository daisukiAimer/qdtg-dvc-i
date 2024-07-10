import { resolve } from "node:path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import electron from "vite-plugin-electron";
import { viteCommonjs } from "@originjs/vite-plugin-commonjs";
import requireTransform from "vite-plugin-require-transform";

export default defineConfig({
  /*define: {
        'process.env': {
            'FLUENTFFMPEG_COV': false
        }
    },*/
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        upgrade: resolve(__dirname, "upgrade.html"),
      },
    },
  },
  plugins: [
    vue(),
    viteCommonjs(),
    electron({
      entry: "electron/index.js",
      vite: {
        build: {
          // outDir: "dist",
          /*emptyOutDir: false,
                    publicDir: true,
                    commonjsOptions: {
                        include: [/node_modules/, /electron/]
                        // include: [/electron/]
                    },
                    plugins: [
                        requireTransform({
                            fileRegex: /.js$/
                        })
                    ],*/
          /*rollupOptions: {
                        // Here are some C/C++ plugins that can't be built properly.
                        external: [
                            'fluent-ffmpeg',
                        ]
                    }*/
          win: {
            icon: "./src/assets/app.png",
          },
        },
      },
    }),
  ],
});
