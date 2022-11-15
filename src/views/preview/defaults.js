import { genIntArray, genGrayRGB } from '../../utils';

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
