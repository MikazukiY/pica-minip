// 1. Install dependencies
//    npm install --save minip-bridge
//    npm install --save-dev archiver @types/archiver qrcode @types/qrcode
// 2. Add this plugin, `base: ""`, `server: { host: "0.0.0.0"}` to vite.config.ts
// 3. add `"pack": "vite build && vite preview"` to package.json

import archiver from "archiver";
import fs from "fs";
import path from "path";
import qrcode from "qrcode";
import { PluginOption, PreviewServer } from "vite";
import { randomUUID } from "crypto";

const configFile = "app.json";

const plugin: PluginOption = {
  name: "minip-plugin",
  closeBundle() {
    function getRelativeFilePath(p: string, filepath: string) {
      const i = filepath.indexOf(p);
      return filepath.substring(i + p.length);
    }

    interface FileInfo {
      name: string;
      path: string;
    }
    interface AppInfo {
      appId: string;
      homepage: string;
      icon?: string;
      files?: FileInfo[];
      name: string;
    }
    let appInfo: AppInfo;
    if (!fs.existsSync(configFile)) {
      appInfo = {
        appId: randomUUID(),
        name: path.basename(__dirname),
        homepage: "index.html",
      };
      fs.writeFileSync(configFile, JSON.stringify(appInfo, null, 2));
    } else {
      appInfo = JSON.parse(fs.readFileSync(configFile, "utf-8")) as AppInfo;
    }
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
  configurePreviewServer(server: PreviewServer) {
    const { printUrls } = server;
    server.printUrls = () => {
      const { resolvedUrls } = server;
      if (resolvedUrls) {
        const appName = JSON.parse(fs.readFileSync(configFile, "utf-8")).name;
        const network = resolvedUrls.network;
        const installSchemes: string[] = [];
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
};

export default function minipPlugin(): PluginOption {
  return plugin;
}