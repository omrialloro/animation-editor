import React, { useState, useEffect,useRef } from "react";
import { Screen } from "./../../components/screen/Screen";
import { Draggable } from 'react-beautiful-dnd';
import {generateDefaultFrames} from "./../../utils/generators";
import {TrimSlider} from "./trimSlider/TrimSlider";
import "./../../components/App.css";



import styled from "styled-components";
const StyledSmall= styled.div`
height: 48px;
width: 48px;
border: 1px solid #000;
background:blue;
opacity:${(props)=>props.isDragging?'0.80':'0'};
z-index: 3;
`

const StyledBox= styled.div`
height: 48px;
width: 48px;
display: grid;
grid-template-columns: repeat(7, 1fr);
grid-template-rows: repeat(7, 1fr);
grid-column-gap: 0;
grid-row-gap: 0;
// margin: 14px;
position: absolute;
`;


export function Editor(props) {

  const {frames, delay, border,updateRange} = props
  const left = border[0]
  const right = border[1]
  const [isPlay,setIsPlay] = useState(false)

  return(
    
    <>
                            <Screen 
                                ref = {useRef()}
                                id = {"ffff"}
                                screenSize = {332}
                                pausedFrameIndex = {0}
                                frames = {frames.slice(left, right)}
                                delay = {isPlay?delay:null}
                              />

        <div className="slide_monitor">
        <TrimSlider min={0} max = {frames.length} range = {[left,right]} updateRange  = {updateRange} width = {"100%"}/>
        </div>
        <div className="btn">         
            <img src={!isPlay?"play_icon.svg":"pause_icon.svg"} onClick={()=>{setIsPlay(!isPlay)}}></img>
        </div>
     
    </>
  )

}