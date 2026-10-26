import fs from "fs";
import path from "path";

const rootDist = path.resolve("dist");
const frontendDist = path.resolve("frontend", "dist");

if (fs.existsSync(rootDist)) {
  fs.cpSync(rootDist, frontendDist, { recursive: true });
} else if (fs.existsSync(frontendDist)) {
  fs.cpSync(frontendDist, rootDist, { recursive: true });
}
