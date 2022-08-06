

import React, { useState, useEffect,useRef } from "react";
import "./components/App.css";
import { ScrollMenu } from 'react-horizontal-scrolling-menu';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Screen from "./components/Screen";
import SliderComp from "./components/SliderComp";
import styled from "styled-components";
import {nestedCopy} from "./components/Utils";
import {changeFrameScheme, getSchemesArray} from "./components/ColorSchemes";
import {grayRGB} from "./components/RGB";
import AudioInput from "./components/AudioInput";
import UseInterval from "./components/UseInterval";
import PlayBar from "./components/PlayBar";
import BrowseAnimations from "./components/BrowseAnimations"
// import Waveform from "./components/Waveform";



import  {reflectFrame,rotateFrame} from "./components/frameTransformations";


let schemes_array = getSchemesArray()

  const StyledWindow= styled.div`
  width: 96px;
  height: 96px;
  margin-right: 4px;
  border: ${(props)=>props.border}px solid #000;
`;

const StyledBox= styled.div`
height: 10px;
width: 10px;
display: grid;
grid-template-columns: repeat(3, 1fr);
grid-template-rows: repeat(3, 1fr);
grid-column-gap: 0;
grid-row-gap: 0;
margin: 14px;
position: absolute;
`;

const StyledSmall= styled.div`
height: 100px;
width: 100px;
border: 1px solid #000;
background:blue;
opacity:${(props)=>props.isDragging?'0.80':'0'};
z-index: 3;
`

function App() {
  const [animations, setAnimations] = useState({"gray":createGrayFrames()})

function resetSelect(){
  const items = Array.from(DATA);
  setSelectedId(null)
}

const ref1 = useRef();
const ref2 = useRef();
const AudioRef = React.useRef({ref1,ref2});
const OutScreenRef = React.useRef();
const MonitorRef = React.useRef();
const SmallScreenRef = React.useRef();
const PlayBarRef = React.useRef();

const handleChoose = (event) => {
  const { ref1, ref2 } = AudioRef.current;
  ref1.current.click();
};

const handlePlay = (event) => {
  const { ref1, ref2 } = AudioRef.current;
  ref2.current.click();
};


function prepareFrames(data){
  let raw_frames = nestedCopy(animations[data["filename"]])
  let operators = data["operators"]
  if(operators["reflect"]==1){
    console.log("reflect")
    raw_frames = raw_frames.map((x)=>(reflectFrame(x)))
  }
  if(operators["reverse"]==1){
    console.log("Reverese")
    raw_frames.reverse()
  }
  if(operators["rotate"]>0){
    console.log("rotate")

    for(let i=0;i<operators["rotate"];i++){
      raw_frames = raw_frames.map((x)=>(rotateFrame(x)))
    }
  }
  if(operators["scheme"]>0){
    let scheme = schemes_array[operators["scheme"]-1]
    raw_frames = changeFrameScheme(raw_frames, scheme)

  }

  let r = data["range"]
  raw_frames = raw_frames.slice(r[0], r[1])
  return raw_frames
}

    function handleOnDragEnd(result) {

        // if (!result.destination) return;
        const items = Array.from(DATA);
        const id ="x"+Date.now().toString()
        if(result.source.index<0){
          resetSelect()
          let info = {};
          info["id"] = id
          info["filename"] = mainScreen["filename"]
          info["dim"] = mainScreen["dim"]
          info["range"] = mainScreen["range"]
          info["operators"]= nestedCopy(mainScreen["operators"])
          console.log(result.destination.index)

          if (result.destination.index>=-1){
            items.splice(result.destination.index+1, 0, info);
            setDATA(items);
          }


        }
        else{
          console.log(result.destination.index)
          const [reorderedItem] = items.splice(result.source.index, 1);
          items.splice(result.destination.index, 0, reorderedItem);
          setDATA(items);
        }
      }

    function deletAnimation(id){
      const items = Array.from(DATA);
      let index =  items.findIndex((el)=>el["id"]==id)
      items.splice(index, 1);
      setDATA(items);
    }

    function duplicateAnimation(id){
      const items = Array.from(DATA);
      let index =  items.findIndex((el)=>el["id"]==id)
      let el = items[index]
      let new_id = "x"+Date.now().toString();
      items.splice(index, 0, {"id":new_id,"range":el["range"],"operators":nestedCopy(el["operators"]),"dim":el["dim"],"filename":el["filename"], "content":el["content"]})
      setDATA(items);
    }
  const [ScreenRange,setScreenRange] = useState({"range":[0,1],"min":0,"max":1})
  // const [operatorsBtns,setOperatorsBtns] = useState({"rotate":0,"reverse":0,"reflect":0})


  function setWindow(id){
       let ttt = DATA.find(x=>x["id"]==id)
       setSelectedId(id)
       setMainScreen(ttt)
  }

  let port = "http://localhost:4000"

  const [screenSize, setScreenSize] = useState(51)
  const [filenames,setFilenames] = useState([]);

  

  useEffect(()=>{
    async function  loadFilenames(){
      let dd = await fetch(port + `/filenames`, {method: 'GET' }).then(res => res.json())
      setFilenames(dd)
    }
    loadFilenames()
  },[])

  function CreateGrayFramesData(r,c,num_frames,id){

    return {
      "id":id,
      "dim":[r,c],
      "range":[0,num_frames],
      "filename":"gray",
      "operators":{"rotate":0,"reflect":0,"reverse":0,"scheme":0}
    }
  }

  let num_frames = 50
  function updateRange(range)  {
    let mainScreen_ = mainScreen
    mainScreen_["range"] = range
    setMainScreen(mainScreen_)
  }

  function mkData(n){
    let data = [];
    for (let i=0;i<n;i++){
      data.push(CreateGrayFramesData(30, 30,num_frames,i))
    }
    return data
  }
  function createGrayFrames(){
    let num_frames = 50
    let c = 30
    let r = 30
    let alpha = 1/num_frames
    const GrayFrame = (alpha)=>Array(r).fill(0).map(()=>(Array(c).fill(0).map(()=>{return grayRGB(alpha)})))
    return Array.from(Array(num_frames).keys()).map((t)=>(GrayFrame(alpha*t)))
  }

  const [data,setData] = useState(mkData(3))
  const [mainScreen, setMainScreen_] = useState(data[0])
  // const [range, setRange] = useState([0,1])


  function setMainScreen(x){
      const items = Array.from(DATA);
      // let tt = items.map((el)=>(el["id"]!=x["id"]?el:x))
      setDATA(items.map((el)=>(el["id"]!=x["id"]?el:x)))
      let frames = animations[x["filename"]]

    setMainScreen_(x)
    setScreenRange({"min":0,"max":frames.length,"range":x["range"]})
    // setRange(x["range"])
    // setOperatorsBtns(x["operators"])
  }
  
  const [FPS,SetFPS] = useState(Math.round(24))
  const [delay,setDelay] = useState(Math.round(1000/FPS))

  
  useEffect(()=>{
    setDelay(Math.round(1000/FPS))
  },[FPS])

  function FPSMinus(){
    if(FPS>1){
      SetFPS(FPS-1)   
    }
  }
  function FPSPlus(){
    if(FPS<60){
      SetFPS(FPS+1)   
    }
  }

  const [OutScreen, setOutScreen] = useState(mainScreen)
  const [len_sec,setLen_sec] = useState(50*(delay/1000))


  const [DATA, setDATA]=useState([
    {"id":"0","dim":mainScreen["dim"],"filename":mainScreen["filename"],"range":mainScreen["range"],"operators":{"rotate":0,"reflect":0,"reverse":0,"scheme":0}},
    {"id": "7","dim":mainScreen["dim"],"filename":mainScreen["filename"],"range":mainScreen["range"],"operators":{"rotate":0,"reflect":0,"reverse":0,"scheme":0}}]);

  const [selectedId, setSelectedId] = useState(null)

  function prepareOutScreenData(data){
    let outFrames = []
    DATA.forEach(element => {
      outFrames = outFrames.concat(prepareFrames(element))

    });
    setLen_sec(outFrames.length*(delay/1000))
    setOutScreen({"id":mainScreen["id"],
    "frames":outFrames,
    "dim":mainScreen["dim"],
    "filename":mainScreen["filename"],
    "range":[1,outFrames.length],
    "operators":{"rotate":0,"reflect":0,"reverse":0,"scheme":0}
  }
    )
    setOutScreenFrame(outFrames[0])
    setMaxFrameIndex(outFrames.length)
  }

  const [name, setName] = useState("monitor")

  function addAnimation(animation,id){
    if(!animation.hasOwnProperty(id)){
      let animations_ = animations
      animations_[id] = animation
      setAnimations(animations_)
    }
    else {
      console("haspropartty")
    }
  }

  function deleteAnimation(animation,id){
    let animations_ = animations
    delete animations_.id
    setAnimations(animations_)
  }

  function clickRotate(){
    let mainScreen_ = mainScreen
    console.log(mainScreen_["operators"]["rotate"])
    mainScreen_["operators"]["rotate"] = (mainScreen_["operators"]["rotate"]+1)%4
    console.log(mainScreen_["operators"]["rotate"])
    setMainScreen(mainScreen_)
  }

  function clickReverse(){
    let mainScreen_ = mainScreen
    console.log(mainScreen_["operators"]["reverse"])
    mainScreen_["operators"]["reverse"] = (mainScreen_["operators"]["reverse"]+1)%2
    console.log(mainScreen_["operators"]["reverse"])
    setMainScreen(mainScreen_)

  }

  function clickReflect(){
    let mainScreen_ = mainScreen
    console.log(mainScreen_["operators"]["reflect"])
    mainScreen_["operators"]["reflect"] = (mainScreen_["operators"]["reflect"]+1)%2
    console.log(mainScreen_["operators"]["reflect"])
    setMainScreen(mainScreen_)

  }

  function clickScheme(){
    let mainScreen_ = mainScreen
    console.log(mainScreen_["operators"]["scheme"])
    mainScreen_["operators"]["scheme"] = (mainScreen_["operators"]["scheme"]+1)%5
    console.log(mainScreen_["operators"]["scheme"])
    setMainScreen(mainScreen_)

  }

  const [offset, setOffset] = useState(0.0)
  const [duration, setDuration] = useState(2)

  function handleOffsetChange(e){
    setOffset(Number(e.target.value))
  }

  function handleDurationChange(e){
    setDuration(Number(e.target.value))
  }

  async function handlePickAnimation(filename) {
    if (!animations.hasOwnProperty(filename)){
      let  a = await fetch(port + `/api/${filename}`, {method: 'GET' }).then(res => res.json())
      addAnimation(a["data"], filename)
    }
    let id  = "x"+Date.now().toString();
    setTimeout(()=>{
      setMainScreen({
      "id":id,
      "filename":filename,
      "dim":[30,30],
      "range":[0,animations[filename].length],
      // "frames":animations[filename].map((x)=>(rotateFrame(x))),
      "operators":{"rotate":0,"reflect":0,"reverse":0,"scheme":0}
    })
  },10)
  }

  const [frameImg, setFrameImg] = useState();

  useEffect(()=>{
    prepareOutScreenData()
    console.log(OutScreen)

  },[mainScreen,DATA])
let frammmes = prepareFrames(mainScreen)
console.log(frammmes.length)

let i = 0;
const [FrameIndex, setFrameIndex] = useState(0)

const [isRunning, setIsRunning] = useState(false)
UseInterval(() => {
  i+=1;
  if (i>=frammmes.length-1){
    i=0
  }
  MonitorRef.current(frammmes[i])
}, isRunning?delay:null);

function toggleMonitorPlay(){
  setIsRunning(!isRunning)
}

const [isRunningOutScreen, setIsRunningOutScreen] = useState(false)

const [MaxFrameIndex, setMaxFrameIndex] = useState(10)
let ii = FrameIndex;

console.log(document.getElementById("frames_counter"))
UseInterval(() => {
  ii+=1;
  document.querySelector(".frames_counter").innerHTML = ii;
  if(isTime){
    document.querySelector(".frames_counter").innerHTML= ii+"/"+MaxFrameIndex;
  }
  else{
    document.querySelector(".frames_counter").innerHTML = (ii/FPS).toFixed(2)+"/"+(MaxFrameIndex/FPS).toFixed(2);
  }

  if (ii>=OutScreen["frames"].length-1){
    ii=0
  }
  OutScreenRef.current(OutScreen["frames"][ii])
  PlayBarRef.current(ii)

}, isRunningOutScreen?delay:null);

const [isPlay, SetIsPlay] = useState(false)

function toggleOutScreenPlay(){
  setIsRunningOutScreen(!isRunningOutScreen)
  handlePlay()
  SetIsPlay(!isPlay)
}
const [isTime,setIsTime] = useState(true)

function changeToTime(){
  setIsTime(true)
}
function changeToFrames(){
  setIsTime(false)
}



function updateFrameIndex(index){
  setFrameIndex(index)
  setOutScreenFrame(OutScreen["frames"][index])
}

const [outScreenFrame, setOutScreenFrame] = useState(frammmes[0])

return (
<body>

<DragDropContext  onDragEnd={handleOnDragEnd}>
<Droppable droppableId="droppable" direction="horizontal">
    {(provided) => {return (

<main {...provided.droppableProps} ref={provided.innerRef}>
  <div className="container_left">
    <div className="inner_container_left">
    <div className="container_monitor">
    <div className="monitor">
                            <StyledBox >
                            {[...Array(9).keys()].map((k,index)=>( <Draggable key={'monitor'+k+100000} draggableId={'f'+k} index={-index-1}>
                    {(provided,snapshot)=>(
                               <StyledSmall
                                isDragging = {snapshot.isDragging}
                                {...provided.dragHandleProps}
                                {...provided.draggableProps}
                                ref={provided.innerRef}
                                />
                    )}

                </Draggable>))}
              {provided.placeholder}

                            </StyledBox>
                                <Screen ref = {MonitorRef}
                              id = "tt"  vp_percent = {31}  DefaultFrame ={frammmes[0]}/>

        {/* {provided.placeholder} */}
        </div>
        <div className="slide_monitor">
        <SliderComp min={ScreenRange["min"]} max = {ScreenRange["max"]} range = {ScreenRange["range"]} updateRange  = {updateRange} width = {340}/>
        </div>
        <div className="btn">         
             <img src={!isPlay?"play_icon.svg":"pause_icon.svg"} onClick={toggleMonitorPlay}></img>
          </div>
        </div>
        <div className="container_btns">    
    <div className="container_btn invert" onClick={clickReverse}>
      <div className="btn">
      <img src="reverse_icon.svg"></img>
      </div>
        <p>mirror</p>
    </div>
    <div className="container_btn reflect" onClick={clickReflect}>
      <div className="btn">
      <img src="reflect_icon.svg"></img>
      </div>
        <p>reverse</p>
    </div>

    <div className="container_btn flip_vert" onClick={clickRotate}>
      <div className="btn">
      <img src="switch_icon.svg"></img>

      </div>
        <p>rotate</p>
    </div>
    <div className="container_btn color_scheme" onClick={clickScheme}>
      <div className="btn" >
      <img src="reverse_icon.svg"></img>

      </div>
        <p>scheme</p>
    </div>
 </div>
 </div>

 <AudioInput ref = {AudioRef} start_sec={offset} stop_sec={offset+len_sec}></AudioInput>

      {/* <div className="add_music" onClick={handleChoose}>
            <p>add music</p>
      </div> */}

      {/* <input value={offset} onChange={handleOffsetChange} />
      <input value={duration} onChange={handleDurationChange} /> */}
      <div className="library" >
        {/* <form action="/action_page.php">
              <select name="schemes" id="scheme"  onChange={handleSelectChange}>
                {filenames.map((f)=>(<option>{f}</option>))}
              </select>
        </form> */}
        <BrowseAnimations PickAnimation = {handlePickAnimation}/>
      </div>

  </div>


  <div className="container_right" >
        <div>
                <ScrollMenu>
                <div className="order" >
                    {DATA.map((k,index)=>( <Draggable key={k["id"]+1000} draggableId={k["id"]} index={index}>
                    {(provided)=>(
                            <div className="position2" {...provided.dragHandleProps} {...provided.draggableProps} ref={provided.innerRef}>
                            <StyledWindow border={k["id"]==selectedId?10:2} onClick={()=>{setWindow(k["id"])}}>
                             <Screen ref = {SmallScreenRef}  id = {"tt"+k["id"]}  vp_percent = {9} DefaultFrame = {prepareFrames(k)[0]}/>
                            </StyledWindow>
                            <p onClick={()=>{deletAnimation(k["id"])}}>xx</p>
                            <p onClick={()=>{duplicateAnimation(k["id"])}}>+</p>

                        </div>
                    )}

                </Draggable>))}
                {provided.placeholder}

              </div>
              </ScrollMenu>
              <div className="screen">
              <Screen ref = {OutScreenRef} id = {"tdfffff"} vp_percent = {52} delay = {delay} DefaultFrame = {outScreenFrame}/>
              <PlayBar ref = {PlayBarRef} min ={0} max={MaxFrameIndex} width = {560} UpdateFrameIndex = {updateFrameIndex}></PlayBar>
              {/* <div className="download" onClick={toggleOutScreenPlay}> 
            <p>play</p>
     </div> */}
     <div className="container_play">
       <div className="vvv">
          <div className="btn">         
             <img src={!isPlay?"play_icon.svg":"pause_icon.svg"} onClick={toggleOutScreenPlay}></img>
          </div>
          <div className="frames_counter">{isTime?ii+"/"+MaxFrameIndex:(ii/FPS).toFixed(2)+"/"+(MaxFrameIndex/FPS).toFixed(2)}</div>
          <div className="toggle_frame_time" onClick={changeToTime} style={isTime?{backgroundColor:"#0066cc"}:{backgroundColor:"#0080ff"}}>F</div>
          <div className="toggle_frame_time" onClick={changeToFrames} style={isTime?{backgroundColor:"#0080ff"}:{backgroundColor:"#0066cc"}}>T</div>



       </div>
          <div className="speed">
                <div className="minus" onClick={FPSMinus}>
                  <img src="minus.svg"></img>    
                </div>
                  <p>{FPS} FPS</p>
                <div className="plus"  onClick={FPSPlus}>
                    <img src="plus.svg"></img>
                </div>
            </div>
          </div>
        </div>
      </div>
  </div>
</main>

)}}
</Droppable>

</DragDropContext>


</body>
  );
}


export default App;
