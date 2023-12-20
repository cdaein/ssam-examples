import { defineConfig, loadEnv } from "vite";
import { ssamExport } from "vite-plugin-ssam-export";
import { ssamFfmpeg } from "vite-plugin-ssam-ffmpeg";
import { ssamGit } from "vite-plugin-ssam-git";
// import { ssamTimelapse } from "vite-plugin-ssam-timelapse";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    base: "./",
    define: {
      SKETCH: JSON.stringify(env.SKETCH),
    },
    plugins: [
      ssamExport({ outDir: `./docs` }),
      ssamGit(),
      ssamFfmpeg(),
      // ssamTimelapse(),
    ],
    clearScreen: false,
    build: {
      outDir: "./dist",
      assetsDir: ".",
      rollupOptions: {
        //
      },
    },
  };
});
