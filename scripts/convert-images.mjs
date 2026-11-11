import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

const inputDir = "public/photos";
const outputDir = "public/photos-webp";

await fs.mkdir(outputDir, { recursive: true });

const files = await fs.readdir(inputDir);
const pngFiles = files.filter((file) => file.endsWith(".png"));

for (const file of pngFiles) {
  const input = path.join(inputDir, file);
  const output = path.join(outputDir, file.replace(".png", ".webp"));

  await sharp(input).webp({ quality: 80 }).toFile(output);

  console.log(`Converted: ${file}`);
}

console.log(`Done! Converted ${pngFiles.length} images.`);
