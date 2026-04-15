import sizeOf from 'image-size';
const dimensions = sizeOf('build/icon.png');
console.log(dimensions.width, dimensions.height);
