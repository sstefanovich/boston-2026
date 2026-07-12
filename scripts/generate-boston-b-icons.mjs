import sharp from 'sharp';
import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const svg = readFileSync(join(root, 'public/favicon.svg'));

const mipmapSizes = {
  'mipmap-mdpi': 48,
  'mipmap-hdpi': 72,
  'mipmap-xhdpi': 96,
  'mipmap-xxhdpi': 144,
  'mipmap-xxxhdpi': 192,
};

async function writePng(buffer, size, outPath) {
  mkdirSync(dirname(outPath), { recursive: true });
  await sharp(buffer).resize(size, size).png().toFile(outPath);
}

async function main() {
  const webExports = [
    { rel: 'public/favicon.png', size: 512 },
    { rel: 'public/favicon-32.png', size: 32 },
    { rel: 'public/apple-touch-icon.png', size: 180 },
    { rel: 'public/icons/boston-icon-1024.png', size: 1024 },
  ];

  for (const entry of webExports) {
    await writePng(svg, entry.size, join(root, entry.rel));
    console.log(`Wrote ${entry.rel} (${entry.size}px)`);
  }

  for (const [folder, size] of Object.entries(mipmapSizes)) {
    const dir = join(root, 'android/app/src/main/res', folder);
    mkdirSync(dir, { recursive: true });
    for (const name of ['ic_launcher.png', 'ic_launcher_round.png', 'ic_launcher_foreground.png']) {
      await writePng(svg, size, join(dir, name));
    }
    console.log(`Wrote ${folder} (${size}px)`);
  }

  console.log('Boston B icons generated from favicon.svg');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
