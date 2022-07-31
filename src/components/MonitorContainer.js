import React, { useState, useEffect,useRef } from "react";
import styled from "styled-components";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';



const StyledBox= styled.div`
height: 480px;
width: 480px;
display: grid;
grid-template-columns: repeat(3, 1fr);
grid-template-rows: repeat(3, 1fr);
grid-column-gap: 0;
grid-row-gap: 0;
position: absolute;
`;

const StyledContainer= styled.div`
height: 480px;
width: 480px;
position: relative;
border: 2px solid #000;
`;


const StyledSmall= styled.div`
height: 160px;
width: 160px;
border: 2px solid #000;
background:blue;


z-index: 3;

`


const StyledBig= styled.div`
height: 480px;
width: 480px;
border: 2px solid #000;
position: absolute;
background:red;
z-index: 2;
`




// const [isVisible, setVisibility] = useState()

function fff(){
    return 
}


const Monitor = (props) => {



        return (
            <DragDropContext   onDragEnd={fff}>
              <Droppable droppableId="droppableeee" direction="horizontal">
                 {(provided) => {return (  
                            
            <StyledContainer>
                <StyledBox > 
                <Draggable  key={"11"} draggableId={"11"} index={100}>
                    {(provided,snapshot)=>(
                                            <StyledSmall 
                                            // isDragging = {snapshot.isDragging}
                                            {...provided.dragHandleProps} 
                                            {...provided.draggableProps} 
                                            ref={provided.innerRef}
                                            
                                            />

                    )}
                      </Draggable>

                      <Draggable  key={"22"} draggableId={"22"} index={200}>
                    {(provided,snapshot)=>(
                                            <StyledSmall 
                                            // isDragging = {snapshot.isDragging}
                                            {...provided.dragHandleProps} 
                                            {...provided.draggableProps} 
                                            ref={provided.innerRef}
                                            />

                    )}
                      </Draggable>

                      <Draggable  key={"33"} draggableId={"33"} index={300}>
                    {(provided,snapshot)=>(
                                            <StyledSmall
                                            // isDragging = {snapshot.isDragging}
                                            {...provided.dragHandleProps} 
                                            {...provided.draggableProps} 
                                            ref={provided.innerRef}
                                            />

                    )}
                      </Draggable>

                      


                      <Draggable  key={"44"} draggableId={"44"} index={400}>
                    {(provided,snapshot)=>(
                                            <StyledSmall
                                            // isDragging = {snapshot.isDragging}
                                            {...provided.dragHandleProps} 
                                            {...provided.draggableProps} 
                                            ref={provided.innerRef}
                                            />

                    )}
                      </Draggable>

                      <Draggable  key={"55"} draggableId={"55"} index={500}>
                    {(provided,snapshot)=>(
                                            <StyledSmall
                                            // isDragging = {snapshot.isDragging}
                                            {...provided.dragHandleProps} 
                                            {...provided.draggableProps} 
                                            ref={provided.innerRef}/>

                    )}
                      </Draggable>

                      <Draggable  key={"66"} draggableId={"66"} index={600}>
                    {(provided,snapshot)=>(
                                            <StyledSmall
                                            // isDragging = {snapshot.isDragging}
                                            {...provided.dragHandleProps} 
                                            {...provided.draggableProps} 
                                            ref={provided.innerRef}/>

                    )}
                      </Draggable>

         
                    <StyledSmall/>
                    <StyledSmall/>
                    <StyledSmall/>

                </StyledBox>
        <StyledBig></StyledBig>
                
                 </StyledContainer>
)}}
                                  </Droppable>
                 </DragDropContext>


    )
}

export default Monitor