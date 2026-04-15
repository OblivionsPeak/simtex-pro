const pngToIco = require('png-to-ico');
const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'build', 'icon.png');
const outputPath = path.join(__dirname, 'build', 'icon.ico');

pngToIco(inputPath)
  .then(buf => {
    fs.writeFileSync(outputPath, buf);
    console.log('Icon converted to .ico successfully');
  })
  .catch(err => {
    console.error('Error converting icon:', err);
  });
