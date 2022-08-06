
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
  padding: 13px 0;
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



const PlayBar = forwardRef((props, ref) => {
  const onChange = (event, newValue)=>{
    setVal(newValue)
    // props.UpdateFrameIndex(newValue)
  }
  const onChangeCommitted = (event, newValue)=>{
    // setVal(newValue)
    props.UpdateFrameIndex(newValue)
  }
// function PlayBar(props) {
  const [val,setVal] = useState(0)
  ref.current = setVal
  return (
    <Box sx={{ width: 300 }}>
      <StyledSlider defaultValue={90} value={val} 
      min={props.min}
      max={props.max}
      onChange= {onChange}
      onChangeCommitted= {onChangeCommitted}
       sx={{
        width: props.width,
        height: "8px",
        color: 'green',
        WebkitAppearance: 'slider-vertical',
        '& .MuiSlider-thumb': {
          width: "20px",
          height: '24px',
          borderRadius: '30%',
          background: '#F72C2C',
          text:"fff",
        },
      }}
      />
    </Box>
  );
})
export default PlayBar;
