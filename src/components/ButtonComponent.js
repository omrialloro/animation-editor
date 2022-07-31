import React from 'react'
import styled from "styled-components";

  const StyledButton = styled.div
  `display: flex;
  justify-content: center;
  align-content: center;
  background-color: #9DF49D;
  `
  ;   

const ButtonComponent = (props) => {
  return (
    <StyledButton onClick={props.click}>{props.text}</StyledButton>
  )
}

export default ButtonComponent