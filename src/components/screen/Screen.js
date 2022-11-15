import styled from "styled-components";
import React, {useRef, useEffect, forwardRef } from "react";
import { genIntArray } from '../../utils/generators';
import { useInterval } from "./../useInterval";


function setFrame(frame, screen_id){
  let c = frame.length
  let r = frame[0].length
  let AA = Array.from(Array(c).keys())
  let BB = Array.from(Array(r).keys())

   AA.map((x)=>(
      BB.map((y)=>(
        document.getElementById(`${x}_${y}_${screen_id}`).style.backgroundColor = frame[y][x]        
      ))
  ))
}

const StyledScreen= styled.div`
  height: ${(props)=>props.screenSize}px;
  width: ${(props)=>props.screenSize}px;
  display: grid;
  grid-template-columns: repeat(${(props)=>props.col}, 1fr);
  grid-template-rows: repeat(${(props)=>props.row}, 1fr);
  grid-column-gap: 0.001px;
  grid-row-gap: 0.001px;
  `;

const calcPixelSize = (col, row, screenSize)=> ([(screenSize)/col,(screenSize)/row]);

export const Screen = forwardRef((props, ref) => {

  const {screenSize, frames, pausedFrameIndex, delay, id} = props

  let currentFrame = pausedFrameIndex;
  useInterval(() => {
    setFrame(frames[currentFrame],id)
    if (currentFrame>=frames.length-1){
      currentFrame=0;
    }
    else {
      currentFrame+=1;
    }
    ref.current = currentFrame;
  }, delay);

  const rowLen = frames[0].length
  const colLen = frames[0][0].length    
  
  const row = genIntArray(rowLen);
  const col = genIntArray(colLen);
  const [height, width] = calcPixelSize(rowLen,colLen, screenSize) 

  return (
    <div
      style={{
        height: `${screenSize}px`,
        width: `${screenSize}px`,
        display: 'grid',
        gridTemplateColumns: `repeat(${colLen}, 1fr)`,
        gridTemplateRows: `repeat(${rowLen}, 1fr)`,
        gap: '0.001px',
      }}
    >
      {row.map((x)=>(
        col.map((y)=>(
          <div
            id={`${x}_${y}_${id}`}
            key={[x,y]}
            style={{
              backgroundColor: frames[pausedFrameIndex][y][x],
              height,
              width,
              border: '0.0px solid grey',
            }}
          />
        ))
      ))}
    </div>
  );
});
