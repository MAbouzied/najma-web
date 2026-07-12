import fs from "fs";
import path from "path";

export function loadPageHtml(fileName: string): string {
  const filePath = path.join(
    process.cwd(),
    "src",
    "content",
    "html",
    `${fileName}.html`,
  );
  return fs.readFileSync(filePath, "utf-8");
}
