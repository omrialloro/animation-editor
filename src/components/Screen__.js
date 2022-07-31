import styled from "styled-components";
import Pixel from "./Pixel";
import SliderComp from "./SliderComp";
import { Draggable } from "react-beautiful-dnd";


import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { palette } from "@mui/system";

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

function runLoop(id,range,data){
  let i=range[0]
  let interval = setInterval(() => {
    i+=1;
    if (i>=range[1]-1){
      i=range[0]
    }
    setFrame(data["frames"][i], id);
  }, 50);
  return interval
}
function runLoop_(frames,id){
  // console.log(data["operators"])
  // let frames = []
  // if(data.hasOwnProperty("frames")){
  //   frames = data["frames"]
  // }
  // frames = prepareFrames(data)
  let l = frames.length
  let i=0
  let interval = setInterval(() => {
    i+=1;
    if (i>=l-1){
      i=0
    }
    setFrame(frames[i], id);
  }, 30);
  return interval
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
  useImperativeHandle(ref, ()=>({
    showAlert() {
      isPlay = !isPlay
      if(false){
        interval.current = runLoop(id,data["range"],data);
      }
      else{
        clearInterval(interval.current)
      }
    },
  }))
  const interval = useRef();
  useEffect(() => {
    return () => clearInterval(interval.current);
}, []);

let I = 0

function onHover(){
  console.log("DDDDDDDDDHOVVVER")
  let frames = []
  if(data.hasOwnProperty("frames")){
    frames = data["frames"]
  }
  else{
    frames = prepareFrames(data)
  }
  I = runLoop_(frames,id)
  setTimeout(()=>{
    clearInterval(I);

  },15000)
}

function offHover(){
  clearInterval(I);
}


  const {vp_percent,data,prepareFrames, id} = props
      let frames = []
      if(data.hasOwnProperty("frames")){
        frames = data["frames"]

      }
      else{
        frames = prepareFrames(data)
      }

 
      const frame=frames[0]
      const n=data["dim"][0]
      const m=data["dim"][1]
    return (

<Draggable  key={"x"+Date.now().toString()} draggableId={"x"+Date.now().toString()} index={-1}>
{(provided,snapshot)=>(
      <StyledScreen 
      isDragging = {snapshot.isDragging}
      {...provided.dragHandleProps} 
      {...provided.draggableProps} 
      ref={provided.innerRef} 
      onMouseEnter={() => onHover()}
      onMouseLeave={() => offHover()}
      col={m} row={n} vp_percent={vp_percent} >
{             create_screen(m,n,vp_percent, frame, id)
}      </StyledScreen>

                                                  
)}
</Draggable>


)
})

export default Screen 

