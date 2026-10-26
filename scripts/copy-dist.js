import fs from "fs";
import path from "path";

const rootDist = path.resolve("dist");
const frontendDist = path.resolve("frontend", "dist");

try {
  if (fs.existsSync(rootDist)) {
    fs.mkdirSync(frontendDist, { recursive: true });
    for (const file of fs.readdirSync(rootDist)) {
      const src = path.join(rootDist, file);
      const dest = path.join(frontendDist, file);
      fs.cpSync(src, dest, { recursive: true });
    }
  }
} catch (err) {
  //
}
