import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, '../public/images');

// Files to skip (small UI assets, logos)
const skip = new Set(['favicon.png', 'logo_dark.png', 'logo_light.png', 'appstore_badge.png']);

const files = fs.readdirSync(dir).filter(f => /\.(jpg|jpeg|png)$/i.test(f) && !skip.has(f));

for (const file of files) {
  const fp = path.join(dir, file);
  const origSize = fs.statSync(fp).size;
  const ext = path.extname(file).toLowerCase();
  const base = path.basename(file, ext);
  const webpPath = path.join(dir, base + '.webp');

  const meta = await sharp(fp).metadata();
  // Cap width at 1200px for hero/large images; smaller service images keep their size
  const maxW = 1200;
  const resize = meta.width > maxW ? { width: maxW, withoutEnlargement: true } : undefined;

  // WebP version (primary format served to modern browsers)
  await sharp(fp)
    .resize(resize)
    .webp({ quality: 78, effort: 4 })
    .toFile(webpPath);

  // Compress the original in-place as fallback
  const buf = ext === '.png'
    ? await sharp(fp).resize(resize).png({ compressionLevel: 9, effort: 10 }).toBuffer()
    : await sharp(fp).resize(resize).jpeg({ quality: 78, progressive: true, mozjpeg: true }).toBuffer();
  fs.writeFileSync(fp, buf);

  const newSize = fs.statSync(fp).size;
  const webpSize = fs.statSync(webpPath).size;
  const savedPct = Math.round((1 - newSize / origSize) * 100);
  console.log(`${file.padEnd(25)} ${(origSize/1024).toFixed(0).padStart(5)}KB → ${(newSize/1024).toFixed(0).padStart(4)}KB (${savedPct}% saved) | WebP: ${(webpSize/1024).toFixed(0)}KB`);
}
console.log('\nDone.');