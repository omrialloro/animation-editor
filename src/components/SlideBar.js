
import * as React from 'react';
import { styled, alpha, Box } from '@mui/system';
import SliderUnstyled, { sliderUnstyledClasses } from '@mui/base/SliderUnstyled';
// import UseInterval from './components/UseInterval';
import { useState, forwardRef} from "react";

const StyledSlider = styled(SliderUnstyled)(
  ({ theme }) => `
  color: ${theme.palette.mode === 'light' ? '#1976d2' : '#90caf9'};
  height: 4px;
  width: 100%;
  padding: 3px 0;
  display: inline-block;
  position: relative;
  cursor: pointer;
  touch-action: none;
  -webkit-tap-highlight-color: transparent;
  opacity: 0.75;

  &:hover {
    opacity: 1;
  }

  &.${sliderUnstyledClasses.disabled} { 
    pointer-events: none;
    cursor: default;
    color: #bdbdbd; 
  }

  & .${sliderUnstyledClasses.rail} {
    display: block;
    position: absolute;
    width: 100%;
    height: 20px;
    border-radius: 2px;
    background-color: currentColor;
    opacity: 0.38;
  }

  & .${sliderUnstyledClasses.track} {
    display: block;
    position: absolute;
    height: 10px;
    border-radius: 2px;
    background-color: currentColor;
  }

  & .${sliderUnstyledClasses.thumb} {
    position: absolute;
    width: 14px;
    height: 14px;
    margin-left: -6px;
    margin-top: -5px;
    box-sizing: border-box;
    border-radius: 50%;
    outline: 0;
    border: 2px solid currentColor;
    background-color: #fff;

    :hover,
    &.${sliderUnstyledClasses.focusVisible} {
      box-shadow: 0 0 0 0.25rem ${alpha(
        theme.palette.mode === 'light' ? '#1976d2' : '#90caf9',
        0.15,
      )};
    }

    &.${sliderUnstyledClasses.active} {
      box-shadow: 0 0 0 0.25rem ${alpha(
        theme.palette.mode === 'light' ? '#1976d2' : '#90caf9',
        0.3,
      )};
    }
  }
`,
);



const SlideBar = forwardRef((props, ref) => {
  const [val,setVal] = useState(0)
  const onChange = (event, newValue)=>{
    setVal(newValue)
    props.Focus()
  }

  
  ref.current = val
  return (
    <Box sx={{ width: props.width, visibility:props.visibility?'visible': 'hidden'} }>
    <StyledSlider defaultValue={1} value={val} 
    min={0}
    max={props.max}
    onChange= {onChange}
    sx={{
      width: props.width,
      height: "18px",
      color: 'salmon',
      WebkitAppearance: 'slider-vertical',
      '& .MuiSlider-thumb': {
        width: "10px",
        height: '64px',
        borderRadius: '10%',
        background: '#F72C2C',
        text:"fff",
      },
    }}
  />
  </Box>
  );
})
export default SlideBar;
