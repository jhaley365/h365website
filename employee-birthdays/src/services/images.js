const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '..', '..', 'public', 'images', 'birthday');

function listBirthdayImages() {
  return fs
    .readdirSync(imagesDir)
    .filter((f) => f.toLowerCase().endsWith('.png'))
    .map((f) => path.join(imagesDir, f));
}

function pickRandomBirthdayImage() {
  const images = listBirthdayImages();
  if (images.length === 0) {
    throw new Error(
      `No birthday images found in ${imagesDir}. Run "npm run generate-images" first.`
    );
  }
  const index = Math.floor(Math.random() * images.length);
  return images[index];
}

module.exports = { listBirthdayImages, pickRandomBirthdayImage };
