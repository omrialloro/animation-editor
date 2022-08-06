import Slider from '@mui/material/Slider';
// import { createTheme } from '@mui/material/styles';
// import { ThemeProvider } from '@mui/material/styles';


// import * as React from 'react';
import Box from '@mui/material/Box';

import { useState } from "react"
import { useEffect } from 'react';

function valuetext(value) {
    return `${value}`;
}

// const muiTheme = createTheme({
//   slider: {
//     trackColor: "yellow",
//     selectionColor: "red"
//   }
// });

  
const SliderComp = (props) => {   
  const [min, setMin] = useState(props.range[0]);
  const [max, setMax] = useState(props.range[1]); 
  useEffect(()=>{
    setMin(props.range[0])
    setMax(props.range[1])
   
  },[props])




    const [value, setValue] = useState(props.range);
    // const handleChange = (event, newValue) => {
    //   setValue(newValue);
    //   props.updateRange(value)
    // };
    
    var timeout;


    const handleChange = (event, newValue) => {
      timeout && clearTimeout(timeout);
      timeout = setTimeout(() => {
        props.updateRange(newValue)
      }, 0);
    };
    const handleChange2 = (event, newValue) => {
      setMin(newValue[0]);
      setMax(newValue[1]);
    };

    const onChangeCommitted = (event, newValue)=>{
      props.updateRange(newValue)
    }
  
    return (
      <Box sx={{ width: 300 }}>
        <div style={{width:props.width} }>
        <Slider
           getAriaLabel={() => "Route Difficulty"}
           value={[min, max]}
           valueLabelDisplay="auto"
           min={props.min}
           max={props.max}
           onChange={handleChange2}
           onChangeCommitted = {onChangeCommitted}
           sx={{
            width: props.width,
            height: "18px",
            color: '#cca300',
            WebkitAppearance: 'slider-vertical',

            '& .MuiSlider-thumb': {
              width: "24px",
              height: '24px',
              borderRadius: '20%',
              background: '#F72C2C',
            },
          }}

           
        />
        </div>
      </Box>
    );
}

export default SliderComp
