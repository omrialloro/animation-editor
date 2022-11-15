import React, { useState, useEffect,useRef } from "react";
import "./components/App.css";
import "./components/base.css";
import './components/fonts.css';

import { ScrollMenu } from 'react-horizontal-scrolling-menu';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import styled from "styled-components";
import {nestedCopy} from "./components/Utils";
import {changeFrameScheme, getSchemesArray,detectScheme} from "./components/ColorSchemes";
import {grayRGB} from "./components/RGB";
import AudioInput from "./components/AudioInput";
import BrowseAnimations from "./components/BrowseAnimations"
import {saveSession,loadSession,extractToGif} from "./components/SaveUtils";
import {Preview} from "./views/preview/Preview"
import {Editor} from "./views/editor/Editor"
import {SmallScreen} from "./views/smallScreen/SmallScreen"
import {SelectedIdProvider} from "./contexts/SelectedIdContext"
import {reflectFrame,rotateFrame} from "./components/frameTransformations";
import {Operators} from "./views/Operators"

let schemes_array = getSchemesArray()

const StyledBox= styled.div`
height: 48px;
width: 48px;
display: grid;
grid-template-columns: repeat(7, 1fr);
grid-template-rows: repeat(7, 1fr);
grid-column-gap: 0;
grid-row-gap: 0;
position: absolute;
`;

const StyledSmall= styled.div`
height: 48px;
width: 48px;
border: 1px solid #000;
background:blue;
opacity:${(props)=>props.isDragging?'0.80':'0'};
z-index: 3;
`

function App() {
  let num_frames = 50
  let dim = [30,30]
  const [animations, setAnimations] = useState({"gray":createGrayFrames(num_frames)})
  console.log("APP")

const ref1 = useRef();
const ref2 = useRef();
const ref3 = useRef();

const AudioRef = React.useRef({ref1,ref2,ref3});

const handleMusicPlay = (event) => {
  const { ref1, ref2,ref3 } = AudioRef.current;
  ref2.current();
};

const handleUploadMusic = ()=>{
  const { ref1, ref2, ref3 } = AudioRef.current;
  // ref1.current.click();
  ref1.current.click()

}

function prepareFrames(data){
  let raw_frames = nestedCopy(animations[data["filename"]])
  let operators = data["operators"]
  if(operators["reflect"]==1){
    raw_frames = raw_frames.map((x)=>(reflectFrame(x)))
  }
  if(operators["reverse"]==1){
    raw_frames.reverse()
  }
  if(operators["rotate"]>0){
    for(let i=0;i<operators["rotate"];i++){
      raw_frames = raw_frames.map((x)=>(rotateFrame(x)))
    }
  }
  if(operators["scheme"]>=0){
    let scheme = schemes_array[operators["scheme"]]
    raw_frames = changeFrameScheme(raw_frames, scheme)
  }
  return raw_frames
}

function handleOnDragEnd(result) {

    // if (!result.destination) return;
    const items = Array.from(DATA);
    const id ="x"+Date.now().toString()
    if(result.source.index<0){
      let info = {};
      info["id"] = id
      info["filename"] = mainScreen["filename"]
      info["dim"] = mainScreen["dim"]
      info["range"] = mainScreen["range"]
      info["operators"]= nestedCopy(mainScreen["operators"])

      if (result.destination.index>=-1){
        items.splice(result.destination.index+1, 0, info);
        setDATA(items);
      }
    }
    else{
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
  // let port = "http://localhost:4000"
  const port = "http://3.83.83.11:4000"
  
  function handleSave() {
    const session_name = window.prompt("enter session name");
    saveSession(session_name, DATA, port)
  }

  function updateRange(range)  {
    let mainScreen_ = mainScreen
    mainScreen_["range"] = range
    setMainScreen(mainScreen_)
  }

  function createGrayFrames(){
    let alpha = 1/num_frames
    const GrayFrame = (alpha)=>Array(dim[1]).fill(0).map(()=>(Array(dim[0]).fill(0).map(()=>{return grayRGB(alpha)})))
    return Array.from(Array(num_frames).keys()).map((t)=>(GrayFrame(1-alpha*t)))
  }

  const [mainScreen, setMainScreen_] = useState({
    "id":0,
    "dim":[dim[0],dim[1]],
    "range":[0,num_frames],
    "filename":"gray",
    "operators":{"rotate":0,"reflect":0,"reverse":0,"scheme":-1}
  })


  function setMainScreen(x){
      const items = Array.from(DATA);
      setDATA(items.map((el)=>(el["id"]!=x["id"]?el:x)))
      setMainScreen_(x)
    }

    function selectScreen(id){
      setMainScreen(DATA.find(x=>x["id"]==id))
 }
  
  let FPS = 24
  const [delay,setDelay] = useState(Math.round(1000/FPS))

  
  useEffect(()=>{
    setDelay(Math.round(1000/FPS))
  },[FPS])

  const [DATA, setDATA]=useState([
    {"id":"0","dim":mainScreen["dim"],"filename":mainScreen["filename"],"range":mainScreen["range"],"operators":{"rotate":0,"reflect":0,"reverse":0,"scheme":-1}},
    {"id": "7","dim":mainScreen["dim"],"filename":mainScreen["filename"],"range":mainScreen["range"],"operators":{"rotate":0,"reflect":0,"reverse":0,"scheme":-1}}]);

  const [timeCodes, SetTimeCodes] = useState([0])

  function prepareOutScreenData(){
    let outFrames = []
    let timeCodes_ = []
    let start_frame = 0;
    DATA.forEach(element => {
      timeCodes_.push([element["id"],start_frame])
      let range = element["range"]
      start_frame +=range[1]
      outFrames = outFrames.concat(prepareFrames(element).slice(range[0],range[1]))
    });
    setProccesedFrames(outFrames)
    SetTimeCodes(timeCodes_)
  }

  function addAnimation(animation,id){
    if(!animation.hasOwnProperty(id)){
      let animations_ = animations
      animations_[id] = animation
      setAnimations(animations_)
    }
  }

  function updateOperatorsState(operatorsState){
    let mainScreen_ = mainScreen
    mainScreen_["operators"] = operatorsState
    setMainScreen(mainScreen_)
  }


  async function PrepareSession(){
    let d = await loadSession(port)
    for (const el of d["data"]){
      let filename = el["filename"]
      if (!animations.hasOwnProperty(filename)){
        let  a = await fetch(port + `/api/${filename}`, {method: 'GET' }).then(res => res.json())
        addAnimation(a["data"], filename)
      }
    }
    
    setDATA(d["data"])
  }


  async function handlePickAnimation(filename) {
    if (!animations.hasOwnProperty(filename)){
      let  a = await fetch(port + `/api/${filename}`, {method: 'GET' }).then(res => res.json())
      addAnimation(a["data"], filename)
    }
    let id  = "x"+Date.now().toString();
    setTimeout(()=>{
      let frames = animations[filename]
      let schemeIndex = detectScheme(frames)[0]
      setMainScreen({
      "id":id,
      "filename":filename,
      "dim":[30,30],
      "range":[0,frames.length],
      "operators":{"rotate":0,"reflect":0,"reverse":0,"scheme":schemeIndex}
    })
  },1)
  }

  useEffect(()=>{
    prepareOutScreenData()
  },[mainScreen,DATA])

let frammmes = prepareFrames(mainScreen)
const [proccesedFrames, setProccesedFrames] = useState(prepareFrames(mainScreen))


function setCurrentTimecodeIndex(index){
  console.log(DATA[index]["id"])
}

function updateDelay(d){
  setDelay(d)
}


return (<SelectedIdProvider>
<div className = "bodyInner">
<div className = "header">
 <ul>
   <li onClick={handleUploadMusic}>upload music</li>
   <li  onClick={()=>extractToGif(port,proccesedFrames, 30)}>create gif</li>
   <li onClick={handleSave}>save session</li>
   <li onClick={()=>PrepareSession()}>load session</li>
 </ul>
</div>

<DragDropContext  onDragEnd={handleOnDragEnd}>
<Droppable droppableId="droppable" direction="horizontal">
    {(provided) => {return (

<main {...provided.droppableProps} ref={provided.innerRef}>
  <div className="container_left">
    <div className="inner_container_left">
    <div className="container_monitor">
    <div className="monitor">
                            <StyledBox >
                            {[...Array(49).keys()].map((k,index)=>( <Draggable key={'monitor'+k+100000} draggableId={'f'+k} index={-index-1}>
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
                            <Editor frames = {frammmes} border = {mainScreen["range"]} delay = {30} updateRange = {updateRange}></Editor>
        {provided.placeholder}
    </div>
    <div className="library" >
    <div className="browse_audio">
          <img src="arrow_browse.svg"></img>
          <p>expand</p>
    </div>
    <BrowseAnimations PickAnimation = {handlePickAnimation}/>
    </div>
    </div>
    <Operators operatorsState = {mainScreen["operators"]} updateOperatorsState={updateOperatorsState}/>
 </div>

  </div>
  <div className="container_right" >
        <div>
                <ScrollMenu>
                <div className="order">
                    {DATA.map((k,index)=>( <Draggable key={k["id"]+1000} draggableId={k["id"]} index={index}>
                    {(provided)=>(
                      <SmallScreen
                       provided = {provided}
                       id = {k["id"]}
                       frames = {prepareFrames(k)}
                       selectScreen = {selectScreen}
                       handleDelete = {()=>deletAnimation(k["id"])}
                       handleDuplicate= {()=>duplicateAnimation(k["id"])}
                       />
                    )}

                </Draggable>))}
                {provided.placeholder}

              </div>
              </ScrollMenu>
              <div className="screen">
                <Preview frames = {proccesedFrames}
                 updateDelay = {updateDelay}
                timeCodes = {timeCodes}
                setCurrentTimecodeIndex = {setCurrentTimecodeIndex}
                />
             </div>
          <AudioInput ref = {AudioRef}></AudioInput>

      </div>
  </div>
</main>

)}}
</Droppable>
</DragDropContext>
</div>
</SelectedIdProvider>
  );
}

export default App;
