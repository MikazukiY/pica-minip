import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import archiver from "archiver";
import fs from "fs";
import path from "path";
import qrcode from "qrcode";

const configFile = "app.json";

export default defineConfig({
  plugins: [
    solidPlugin(),
    {
      name: "zip-output",
      closeBundle() {
        function getRelativeFilePath(p: string, filepath: string) {
          const i = filepath.indexOf(p);
          return filepath.substring(i + p.length);
        }

        interface FileInfo {
          name: string;
          path: string;
        }

        const appInfo = JSON.parse(fs.readFileSync(configFile, "utf-8")) as {
          icon?: string;
          files?: FileInfo[];
          name: string;
        };
        const outputDir = "dist";
        const zipFile = `dist/${appInfo.name}.zip`;

        if (fs.existsSync(zipFile)) {
          fs.unlinkSync(zipFile);
        }

        const output = fs.createWriteStream(zipFile);
        const archive = archiver("zip", { zlib: { level: 9 } });

        output.on("close", () => {
          console.log(
            `packaged success: ${zipFile} (size: ${(
              archive.pointer() / 1024
            ).toFixed(2)} KiB)`
          );
        });

        archive.on("error", (err) => {
          throw err;
        });

        archive.pipe(output);

        const files: FileInfo[] = [];
        const append = (filePath: string, file: string) => {
          if (fs.statSync(filePath).isDirectory()) {
            appendDirectory(filePath);
          } else {
            archive.file(filePath, { name: file });
            const relativePath = (
              file.startsWith(path.sep) ? file.slice(path.sep.length) : file
            ).replaceAll(path.sep, "/");
            files.push({
              name: path.basename(filePath),
              path: relativePath,
            });
          }
        };

        const appendDirectory = (dir: string) => {
          fs.readdirSync(dir).forEach((file) => {
            const fp = path.resolve(dir, file);
            append(fp, getRelativeFilePath(outputDir, fp));
          });
        };

        fs.readdirSync(outputDir).forEach((file) => {
          append(path.resolve(outputDir, file), file);
        });
        let icon = appInfo.icon;
        if (icon) {
          icon = icon.startsWith(path.sep) ? icon.slice(path.sep.length) : icon;
          if (fs.existsSync(icon)) {
            archive.append(fs.readFileSync(icon), {
              name: icon.replaceAll(path.sep, "/"),
            });
          }
        }
        appInfo.files = files;
        archive.append(JSON.stringify(appInfo), { name: "app.json" });
        archive.finalize();
      },
    },
    {
      name: "configure-preview-server",
      configurePreviewServer(server) {
        const { printUrls } = server;
        server.printUrls = () => {
          const { resolvedUrls } = server;
          if (resolvedUrls) {
            const appName = JSON.parse(
              fs.readFileSync(configFile, "utf-8")
            ).name;
            const network = resolvedUrls.network;
            const installSchemes = [];
            for (const url of network) {
              installSchemes.push(`minip://install/${url + appName}.zip`);
            }

            qrcode.toString(
              installSchemes.length === 1
                ? installSchemes[0]
                : JSON.stringify(installSchemes),
              { type: "terminal", small: true },
              (err, url) => {
                if (err) throw err;
                printUrls();
                console.log("Scan this qrcode by Minip App");
                console.log(url);
              }
            );
          } else {
            printUrls();
          }
        };
      },
    },
  ],
  server: {
    host: "192.168.0.32",
  },
  preview: {
    open: false,
  },
  build: {
    target: "esnext",
  },
  base: "",
});
