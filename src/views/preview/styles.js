
import styled from "styled-components";

export const StyledWindow= styled.div`
  width: 48px;
  height: 48px;
  margin-right: 4px;
  // border: ${(props)=>props.border}px solid #000;
  border:30px solid #000;

`;

export const StyledBox= styled.div`
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

export const StyledSmall= styled.div`
height: 48px;
width: 48px;
border: 1px solid #000;
background:blue;
opacity:${(props)=>props.isDragging?'0.80':'0'};
z-index: 3;
`
