// import React, { useState, useEffect,useRef } from "react";
import { Screen,fff } from "./../../components/screen/Screen";
import { useSelectedId,useUpdateSelectedId } from "./../../contexts/SelectedIdContext";

import styled from "styled-components";
import { useState,forwardRef } from "react";



const StyledWindow= styled.div`
width: 48px;
height: 48px;
margin-right: 4px;
// border: ${(props)=>props.border}px solid #000;
border:30px solid #000;
`;
export const SmallScreen = forwardRef((props, ref) => {
// export function SmallScreen(props) {
  const provided = props.provided
  const id = props.id
  const frames = props.frames
  const clickScreen = props.pressed
  const selectScreen = props.selectScreen
  // const [selected, setSeleced] = useState(props.selected)
  const SelectedId = useSelectedId()
  const updateSelectedId = useUpdateSelectedId()
  const handleDelete = props.handleDelete
  const handleDuplicate = props.handleDuplicate



  function setScreen(){

  }

  // function setSelectId(selected_id){
  //   setSeleced(id==selected_id)
  // }

  // ref.current = setSelectId

  // const [bold, setBold] = useState(false)
  // const duplicateAnimation = props.duplicateAnimation
  // const deleteAnimation = props.deleteAnimation
  return (
    <div id ={id} 
      className="position2"
      {...provided.dragHandleProps}
      {...provided.draggableProps}
      ref={provided.innerRef}>
        {/* <StyledWindow id = {"win"+id} onClick={()=>{setWindow(id)}}> */}
      <div onClick = {()=>{updateSelectedId(id);selectScreen(id)}}>
        <Screen 
              screenSize = {SelectedId==id?55:50}
              pausedFrameIndex = {0}
              frames = {frames}
              delay = {null}
              id = {"s333"+id}
        />
        </div>
        {/* </StyledWindow> */}
        <div className="arrange_btn">
          <div className="duplicate" onClick={handleDuplicate}><img src="duplicate.svg"></img></div>
          <div className="minus" onClick={handleDelete}><img src="delete_frame.svg"></img></div>
      </div>
    </div>


  )
}
)