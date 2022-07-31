
function rotateFrame(frame){
  let l = frame.length;
  let N = [...Array(frame.length).keys()]
  return N.map((i)=>(frame.map((x)=>(x[l-1-i]))))
}

function reflectFrame(frame){
    return frame.reverse()
}


export  {reflectFrame,rotateFrame}

