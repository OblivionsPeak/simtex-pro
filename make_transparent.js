import sharp from 'sharp';
import path from 'path';

const inputPath = 'C:/Users/onegu/.gemini/antigravity/brain/41beada2-9047-49cc-b08a-e0281468dd0d/eagle_sprint_decal_1776304281990.png';
const outputPath = 'C:/Users/onegu/.gemini/antigravity/brain/41beada2-9047-49cc-b08a-e0281468dd0d/eagle_sprint_transparent.png';

async function processImage() {
  try {
    const { data, info } = await sharp(inputPath)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const width = info.width;
    const height = info.height;
    const threshold = 245;

    const isWhite = (x, y) => {
      const idx = (y * width + x) * 4;
      return data[idx] > threshold && data[idx + 1] > threshold && data[idx + 2] > threshold;
    };

    const setAlpha = (x, y, a) => {
      const idx = (y * width + x) * 4;
      data[idx + 3] = a;
    };

    // Mask for pixels to be removed
    const removeIdx = new Uint8Array(width * height);

    // Scan from Top
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        if (isWhite(x, y)) removeIdx[y * width + x] = 1;
        else break;
      }
    }

    // Scan from Bottom
    for (let x = 0; x < width; x++) {
      for (let y = height - 1; y >= 0; y--) {
        if (isWhite(x, y)) removeIdx[y * width + x] = 1;
        else break;
      }
    }

    // Scan from Left
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (isWhite(x, y)) removeIdx[y * width + x] = 1;
        else break;
      }
    }

    // Scan from Right
    for (let y = 0; y < height; y++) {
      for (let x = width - 1; x >= 0; x--) {
        if (isWhite(x, y)) removeIdx[y * width + x] = 1;
        else break;
      }
    }

    // Apply Mask
    for (let i = 0; i < width * height; i++) {
      if (removeIdx[i]) data[i * 4 + 3] = 0;
    }

    await sharp(data, {
      raw: { width, height, channels: 4 }
    }).toFile(outputPath);

    console.log('Successfully created hull-transparent PNG');
  } catch (err) {
    console.error('Error processing image:', err);
  }
}

processImage();
