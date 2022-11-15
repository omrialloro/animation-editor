export function genIntArray (length) {
    return Array.from(Array(length).keys());
  }
  
function rgbToH(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
  const MAX_RGB = 255;
  
export function genGrayRGB(alpha){
  const x = Math.round(MAX_RGB * alpha);
  return rgbToH(x, x, x);
}
  
const DEFAULTS_FRAME_SETTINGS = {
    FRAME_NUM: 50,
    COL: 30,
    ROW: 30,
};

function createGrayFrame(alpha){
    const column = Array(DEFAULTS_FRAME_SETTINGS.COL).fill(genGrayRGB(alpha));
    const frame = Array(DEFAULTS_FRAME_SETTINGS.ROW).fill(column);
    return frame;
}

export const generateDefaultFrames = ()=>{
    const delta = 1 / DEFAULTS_FRAME_SETTINGS.FRAME_NUM;
    return genIntArray(DEFAULTS_FRAME_SETTINGS.FRAME_NUM)
        .map((frameIndex)=> createGrayFrame(delta * frameIndex));
}

  