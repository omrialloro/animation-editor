function rgbToH(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
const MAX = 255;

export function genGrayRGB(alpha){
  const x = Math.round(MAX * alpha);
  return rgbToH(x, x, x);
}
