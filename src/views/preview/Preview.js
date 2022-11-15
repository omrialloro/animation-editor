

import React, { useState, useEffect,useRef } from "react";
import { Screen } from "./../../components/screen/Screen";
import { useInterval } from "./../../components/useInterval";
import PlayBar from "./../../views/playbar/PlayBar";
import { useSelectedId,useUpdateSelectedId } from "./../../contexts/SelectedIdContext";


export function Preview(props) {
  const frames = props.frames
  const updateDelay = props.updateDelay
  const timeCodes = props.timeCodes
  const setCurrentTimecodeIndex = props.setCurrentTimecodeIndex
  // const setIsPlay = props.setIsPlay
  // const setCurrentFrameIndex= props.setCurrentFrameIndex

  const updateId = useUpdateSelectedId()
  
const [FPS,SetFPS] = useState(Math.round(44))
const [delay,setDelay] = useState(Math.round(1000/FPS))
const [isPlay, setIsPlay] = useState(false)
const [isTime,setIsTime] = useState(true)
console.log("preview")

useEffect(() => {
  updateDelay(delay)
}, [delay])

function FPSMinus(){
  if(FPS>1){
    SetFPS(FPS-1)   
  }
}
function FPSPlus(){
  if(FPS<60){
    SetFPS(FPS+1)   
  }
}

useEffect(()=>{
  setDelay(Math.round(1000/FPS))
},[FPS])



const [pausedFrameIndex,setPausedFrameIndex] = useState(0)
let timecode_index = [...timeCodes,frames.length].findIndex((el)=>el[1]>pausedFrameIndex)


useEffect(() => {
  setCurrentTimecodeIndex(Math.max(0,timecode_index-1))
  console.log("pausedFrameIndex")
}, [pausedFrameIndex])


let ii = pausedFrameIndex;


console.log(timeCodes)
useInterval(()=>{

  if(ii==timeCodes[timecode_index][1]){
    updateId(timeCodes[timecode_index][0])
    timecode_index =(timecode_index+1)%timeCodes.length

  }
  document.querySelector(".frames_counter").innerHTML = ii;
  if(isTime){
    document.querySelector(".frames_counter").innerHTML= ii+"/"+frames.length;
  }
  else{
    document.querySelector(".frames_counter").innerHTML = (ii/FPS).toFixed(2)+"/"+(frames.length/FPS).toFixed(2);
  }

  ii>=frames.length-1?ii=0:ii+=1;


}, isPlay?delay:null)

const frameIndexRef = useRef()

function updateFrameIndex(index){
  setPausedFrameIndex(index)
  console.log(pausedFrameIndex)
}

function toggleIsPlay(){
  if(isPlay){
    setPausedFrameIndex(frameIndexRef.current)
  }
  setIsPlay(!isPlay)
} 

return (
<>
<div className="screen">
    <Screen ref = {frameIndexRef}
    screenSize = {480}
    pausedFrameIndex = {pausedFrameIndex}
    frames = {frames}
    delay = {isPlay?delay:null}
    id = {"FFFF"}
    />
</div>
<PlayBar 
  updateFrameIndex = {updateFrameIndex}
  pausedFrameIndex = {pausedFrameIndex}
  length={frames.length} 
  delay = {isPlay?delay:null}
  width = {480}
/>

<div className="container_play">
  <div className="vvv" 
    style={{  display: 'flex',
    justifyContent: 'spaceBetween'
  }}
  >

    <div className="btn">
        <img src={!isPlay?`play_icon.svg`:`pause_icon.svg`} onClick={toggleIsPlay}></img>
    </div>

    <div className="frames_counter">
      {isTime?ii+"/"+frames.length:(ii/FPS).toFixed(2)+"/"+(frames.length/FPS).toFixed(2)}
    </div>

    <div className="toggle_frame_time" onClick={()=>setIsTime(false)} style={isTime?{backgroundColor:"#0066cc"}:{backgroundColor:"#0080ff"}}>
      F
    </div>

    <div className="toggle_frame_time" onClick={()=>setIsTime(true)} style={isTime?{backgroundColor:"#0080ff"}:{backgroundColor:"#0066cc"}}>
      T
    </div>

  </div>
    <div className="speed">

          <div className="minus" onClick={FPSMinus}>
            <img src="minus.svg"></img>    
          </div>
            <p>{FPS} FPS</p>

          <div className="plus"  onClick={FPSPlus}>
              <img src="plus.svg"></img>
          </div>
    </div>
</div>
</>
  );
}


