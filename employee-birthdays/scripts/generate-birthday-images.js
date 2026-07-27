#!/usr/bin/env node
// One-off build step: rasterizes the hand-authored SVG source graphics into PNGs.
// PNGs (not SVGs) are what the app actually emails, since Outlook's rendering
// engine does not support inline SVG images.
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const srcDir = path.join(__dirname, '..', 'public', 'images', 'birthday', 'src');
const outDir = path.join(__dirname, '..', 'public', 'images', 'birthday');

async function main() {
  const files = fs.readdirSync(srcDir).filter((f) => f.endsWith('.svg'));
  if (files.length === 0) {
    console.error(`No SVG source files found in ${srcDir}`);
    process.exit(1);
  }

  for (const file of files) {
    const inputPath = path.join(srcDir, file);
    const outputPath = path.join(outDir, file.replace(/\.svg$/, '.png'));
    await sharp(inputPath).png({ quality: 90 }).toFile(outputPath);
    console.log(`Generated ${path.relative(process.cwd(), outputPath)}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
