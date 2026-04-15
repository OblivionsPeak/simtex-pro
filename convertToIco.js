import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.join(__dirname, 'build', 'icon.png');
const tempPngPath = path.join(__dirname, 'build', 'temp.png');
const outputPath = path.join(__dirname, 'build', 'icon.ico');

async function convert() {
  try {
    // 1. Convert JPEG (misnamed as PNG) to a square PNG
    // We resize to 256x256 to ensure it's square and a good size for ico
    await sharp(inputPath)
      .resize(256, 256, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(tempPngPath);
    
    console.log('Temporary square PNG created');

    // 2. Convert PNG to ICO
    const buf = await pngToIco(tempPngPath);
    fs.writeFileSync(outputPath, buf);
    console.log('Icon converted to .ico successfully');

    // Clean up
    fs.unlinkSync(tempPngPath);
    // Overwrite the original misnamed png with the correct one
    fs.renameSync(inputPath, path.join(__dirname, 'build', 'icon_original.jpg'));
    fs.copyFileSync(outputPath, path.join(__dirname, 'build', 'icon.ico'));
    
  } catch (err) {
    console.error('Error during conversion:', err);
  }
}

convert();
