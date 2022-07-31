function rgbToH(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }
function grayRGB(alpha){
    const max = 255
    let x = Math.round(255*alpha)
    return rgbToH(x,x,x) 
  }
  
  export {grayRGB}