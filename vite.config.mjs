import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import checker from "vite-plugin-checker";
import { createWriteStream, existsSync, mkdirSync } from "fs";
import { get as httpsGet } from "https";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Download a file via HTTPS only if the destination doesn't already exist.
 * Falls back silently when offline so incremental builds keep working.
 */
function downloadFile(url, dest) {
  return new Promise((resolve) => {
    if (existsSync(dest)) {
      resolve();
      return;
    }
    const file = createWriteStream(dest);
    httpsGet(url, (res) => {
      if (res.statusCode === 200) {
        res.pipe(file);
        file.on("finish", () => file.close(resolve));
      } else {
        file.close();
        console.warn(`[fonts] HTTP ${res.statusCode} for ${url}`);
        resolve();
      }
    }).on("error", (err) => {
      file.close();
      console.warn(`[fonts] Download failed for ${url}: ${err.message}`);
      resolve();
    });
  });
}

/**
 * Resolve the woff2 URL from a Google Fonts CSS2 response.
 * Sends the request with a desktop User-Agent so Google returns woff2.
 */
function fetchGoogleFontUrl(cssUrl) {
  return new Promise((resolve) => {
    const options = {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 " +
          "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    };
    let body = "";
    httpsGet(cssUrl, options, (res) => {
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => resolve(body));
    }).on("error", (err) => {
      console.warn(`[fonts] Failed to fetch CSS: ${err.message}`);
      resolve("");
    });
  });
}

/**
 * Vite plugin: download Google Fonts woff2 files into public/fonts/ the first
 * time a build runs.  Subsequent builds and offline builds use the cached files.
 */
function localFontsPlugin() {
  return {
    name: "tabquest-local-fonts",
    async buildStart() {
      const fontsDir = path.join(__dirname, "public", "fonts");
      mkdirSync(fontsDir, { recursive: true });

      const targets = [
        {
          cssUrl:
            "https://fonts.googleapis.com/css2?family=Outfit:wght@300..800&display=swap",
          // The API returns a single @font-face for the latin subset in woff2;
          // we grab the first (and only) woff2 src URL.
          destFile: path.join(fontsDir, "outfit-latin.woff2"),
          pickUrl: (css) => {
            const m = css.match(/url\((https:\/\/[^)]+\.woff2)\)/);
            return m ? m[1] : null;
          },
        },
        {
          cssUrl:
            "https://fonts.googleapis.com/css2?family=Mountains+of+Christmas:wght@400&display=swap",
          destFile: path.join(fontsDir, "mountains-of-christmas-400.woff2"),
          pickUrl: (css) => {
            const m = css.match(/url\((https:\/\/[^)]+\.woff2)\)/);
            return m ? m[1] : null;
          },
        },
        {
          cssUrl:
            "https://fonts.googleapis.com/css2?family=Mountains+of+Christmas:wght@700&display=swap",
          destFile: path.join(fontsDir, "mountains-of-christmas-700.woff2"),
          pickUrl: (css) => {
            const m = css.match(/url\((https:\/\/[^)]+\.woff2)\)/);
            return m ? m[1] : null;
          },
        },
      ];

      await Promise.all(
        targets.map(async ({ cssUrl, destFile, pickUrl }) => {
          if (existsSync(destFile)) return; // already cached
          console.log(`[fonts] Fetching ${path.basename(destFile)}...`);
          const css = await fetchGoogleFontUrl(cssUrl);
          const woff2Url = pickUrl(css);
          if (woff2Url) {
            await downloadFile(woff2Url, destFile);
            console.log(`[fonts] Saved ${path.basename(destFile)}`);
          } else {
            console.warn(
              `[fonts] Could not parse woff2 URL from ${cssUrl} — ` +
                "fonts will fall back to system stack",
            );
          }
        }),
      );
    },
  };
}

export default defineConfig({
  plugins: [
    localFontsPlugin(),
    react(),
    tailwindcss(),
    checker({ typescript: true }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Increase limit slightly as 584kB is fine for local extensions
  },
});
