import styled from "styled-components";
import Pixel from "./Pixel";
import React, { useState, useRef, useEffect, forwardRef } from "react";


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


const create_screen = (n,m, vp_percent, frame,id)=>{
    let AA = Array.from(Array(n).keys())
    let BB = Array.from(Array(m).keys())
    let res = calcPixelSize(n,m, vp_percent)
    return AA.map((x)=>(
        BB.map((y)=>(
            <Pixel id ={`${x}_${y}_${id}`} color ={frame[y][x]}  h = {res[0]} w = {res[1]} key={[x,y]} > </Pixel>
        ))
    ))
}

const StyledScreen= styled.div`
height: ${(props)=>props.vp_percent}%;
width: ${(props)=>props.vp_percent}%;
margin: 0 0.1%;
display: grid;
grid-template-columns: repeat(${(props)=>props.col}, 1fr);
grid-template-rows: repeat(${(props)=>props.row}, 1fr);
grid-column-gap: 0;
grid-row-gap: 0;
`;
let isPlay = false;

const calcPixelSize = (c, r, vp_percent)=>{return [(vp_percent)/c,(vp_percent)/r]}
const Screen = forwardRef((props, ref) => {

  const interval = useRef();
  useEffect(() => {
    return () => clearInterval(interval.current);
}, []);

let I = 0

// function onHover(){
//   console.log("DDDDDDDDDHOVVVER")
//   let frames = []
//   if(data.hasOwnProperty("frames")){
//     frames = data["frames"]
//   }
//   else{
//     frames = prepareFrames(data)
//   }
//   // I = runLoop_(frames,id)
//   setTimeout(()=>{
//     clearInterval(I);

//   },15000)
// }

// function offHover(){
//   clearInterval(I);
// }
  const {vp_percent,id,DefaultFrame} = props

  useEffect(()=>{
    setFrame(DefaultFrame,id);
  },[DefaultFrame])

  const n=DefaultFrame.length
  const m=DefaultFrame[0].length
  ref.current =(frame)=> setFrame(frame,id);      
    return (
      <div  >

    <StyledScreen 
            // onMouseEnter={() => onHover()}
            // onMouseLeave={() => offHover()}
            col={m} row={n} vp_percent={vp_percent} >
{             create_screen(m,n,vp_percent, DefaultFrame, id)
}      </StyledScreen>
</div>

)
})

export default Screen 