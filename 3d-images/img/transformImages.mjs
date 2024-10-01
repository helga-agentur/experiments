import { readdirSync, lstatSync } from 'fs';
import { extname } from 'path';
import sharp from 'sharp';

const inDir = 'orig';
const outDir = 'avif';
const fileList = readdirSync(inDir);
console.log(fileList);
for (const file of fileList) {
    const filePath = `${inDir}/${file}`;
    const outPath = `${outDir}/${file.replace('png', 'avif')}`;
    if (lstatSync(filePath).isDirectory()) continue;
    if (extname(filePath) !== '.png') continue;
    console.log(`Convert ${filePath} to ${outPath}`);
    // Ignore e.g. .DS_Store files
    await sharp(filePath)
        .resize({ width: 1280 })
        .avif()
        .toFile(outPath);
    console.log(`${filePath} converted to ${outPath}`);
}

