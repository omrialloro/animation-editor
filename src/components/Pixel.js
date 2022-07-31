import React from 'react'
import styled from "styled-components";

const StyledPixel = styled.div.attrs(props => ({style:{backgroundColor: props.color}}))
    `width: ${(props)=>props.w}vh;
    height: ${(props)=>props.h}vh;
    border: 0.0px solid grey;`; 

    
    

const Pixel = (props) => {
    // console.log(props.w)
    // console.log(props.w)

        return (
        <StyledPixel id={props.id} w = {props.w} h = {props.h} color= {props.color}> 

        </StyledPixel>
    )
}

export default Pixel
