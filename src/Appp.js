
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



import  {reflectFrame,rotateFrame} from "./components/frameTransformations";




let schemes_array = getSchemesArray()
  const StyledWindow= styled.div`
  width: 96px;
  height: 96px;
  margin-right: 4px;
  border: ${(props)=>props.border}px solid #000;
`;

const StyledMonitor= styled.div`
width:336px
height:336px
border: 2px solid #000;
margin: 24px;
z-index: 7;
`;


const StyledBox= styled.div`
height: 10px;
width: 10px;
display: grid;
grid-template-columns: repeat(4, 1fr);
grid-template-rows: repeat(4, 1fr);
grid-column-gap: 0;
grid-row-gap: 0;
margin: 14px;

position: absolute;
`;

const StyledContainer= styled.div`
height: 480px;
width: 480px;
position: relative;
`;


const StyledSmall= styled.div`
height: 96px;
width: 96px;
border: 1px solid #000;
background:blue;
opacity:${(props)=>props.isDragging?'0.80':'0.0'};
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
const inputRef = React.useRef({ref1,ref2});

const inputRef1 = React.useRef();
const inputRef2 = React.useRef();
const inputRef3 = React.useRef();


const handleChoose = (event) => {
  const { ref1, ref2 } = inputRef.current;
  ref1.current.click();
};

const handlePlay = (event) => {
  const { ref1, ref2 } = inputRef.current;
  ref2.current.click();
  inputRef1.current.click();

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
    console.log("rotattttte")
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
  const [operatorsBtns,setOperatorsBtns] = useState({"rotate":0,"reverse":0,"reflect":0})


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
  const [range, setRange] = useState([0,1])


  function setMainScreen(x){
      const items = Array.from(DATA);
      let tt = items.map((el)=>(el["id"]!=x["id"]?el:x))
      setDATA(items.map((el)=>(el["id"]!=x["id"]?el:x)))
      let frames = animations[x["filename"]]
    
    setMainScreen_(x)
    setScreenRange({"min":0,"max":frames.length,"range":x["range"]})
    setRange(x["range"])
    setOperatorsBtns(x["operators"])
  }

  const delay = 30

  const [OutScreen, setOutScreen] = useState(mainScreen)

  const [len_sec,setLen_sec] = useState(50*(delay/1000))


  const [DATA, setDATA]=useState([
    {"id":"0","dim":mainScreen["dim"],"filename":mainScreen["filename"],"range":mainScreen["range"],"operators":{"rotate":0,"reflect":0,"reverse":0,"scheme":0}},
    {"id": "7","dim":mainScreen["dim"],"filename":mainScreen["filename"],"range":mainScreen["range"],"operators":{"rotate":0,"reflect":0,"reverse":0,"scheme":0}}]);

  // const range = [0,50]

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
  function handleOnDragStart(){
    // setScreenSize(12.5)
  }
  function clickRotate(){
    console.log("rotate")
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

  async function handleSelectChange(event) {
    let filename = event.target.value
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

  useEffect(()=>{
    prepareOutScreenData()
  },[mainScreen,DATA])

return (
  <body>
  <header>
    <div className="logo">
    </div>
    <div className="menu_btn">
    </div>
  </header>
  
  
  
  <main>
    <div className="container_left">
      <div className="inner_container_left">
        <div className="container_monitor">
          <div className="monitor">
          </div>
          <div className="slide_monitor">
          </div>
          <div className="btns_bottom_container">
            <div className="browse_audio">
                <p>browse library</p>
            </div>
              <div className="play_stop">
              </div>
          </div>
         
    
        </div>
        <div className="container_btns">
    
          <div className="container_btn invert">
            <div className="btn">
            </div>
              <p>mirror</p>
          </div>
    
          <div className="container_btn reflect">
            <div className="btn">
            </div>
              <p>reverse</p>
          </div>
    
          <div className="container_btn flip_vert">
            <div className="btn">
            </div>
              <p>rotate</p>
          </div>
    
    
    
          <div className="container_btn color_scheme">
            <div className="btn" >
            </div>
              <p>scheme</p>
          </div>
    
       </div>
      </div>
      <div className="library">
        <div className="container_library">
          <div className="arrow"></div>
            <div className="frame_library_container">
              <div className="frame_library frame1"></div>
              <div className="file_title"><p>3.gif</p></div>
            </div>
  
            <div className="frame_library_container">
              <div className="frame_library frame2"></div>
              <div className="file_title"><p>3.gif</p></div>
            </div>
  
            <div className="frame_library_container">
              <div className="frame_library frame3"></div>
              <div className="file_title"><p>7.gif</p></div>
            </div>
  
            <div className="frame_library_container">
              <div className="frame_library frame4"></div>
              <div className="file_title"><p>9.gif</p></div>
            </div>
            <div className="arrow"></div>
  
        </div>
  
        <div className="close_library">
          <p>close</p>
        </div>
      </div>
  
    </div>
    <div className="container_right">
      <div className="container_timeline">
        <div className="arrow_timeline"></div>
  
        <div className="frame_timeline_container">
          <div className="frame_container_inner">
            <div className="move_icon"></div>
            <div className="frame_timeline">
  
            </div>
            <div className="duplicate_icon">
            </div>
          </div>
          <div className="close_icon"></div>
        </div>
  
        <div className="frame_timeline_container">
          <div className="frame_container_inner">
            <div className="move_icon"></div>
            <div className="frame_timeline">
            </div>
            <div className="duplicate_icon"></div>
          </div>
          <div className="close_icon"></div>
        </div>
  
        <div className="frame_timeline_container">
          <div className="frame_container_inner">
            <div className="move_icon"></div>
            <div className="frame_timeline">
            </div>
  
            <div className="duplicate_icon"></div>
          </div>
          <div className="close_icon"></div>
        </div>
  
        <div className="frame_timeline_container ">
          <div className="frame_container_inner">
            <div className="move_icon"></div>
            <div className="frame_timeline ">
            </div>
  
            <div className="duplicate_icon"></div>
          </div>
          <div className="close_icon"></div>
        </div>
  
        <div className="frame_timeline_container empty">
          <div className="frame_container_inner">
            <div className="move_icon"></div>
            <div className="frame_timeline">
            </div>
  
          </div>
          <div className="close_icon"></div>
        </div>
  
        <div className="arrow_timeline"></div>
      </div>
      <div className="screen">
      </div>
  
      <div className="screen_bottom_container">
          <div className="play_stop">
          </div>
          <div className="speed">
            <div className="minus">
            </div>
            <p>12 fps</p>
            <div className="plus">
            </div>
  
          </div>
          <div className="screen_slider">
          </div>
          </div>
          <div className="audio">
            <div className="browse_audio">
                <p>browse audio</p>
            </div>
  
            <div className="mute">
            </div>
            <div className="waveform">
            </div>
            <div className="close_audio">
            </div>
          </div>
          <div className="buttons_bar">
            <div className="audition_btn">
              <p>audition</p>
            </div>
            <div className="download_btn">
              <p>download</p>
            </div>
          </div>
    </div>
  </main>
  

  
  </body>
  
  );
}


export default App;
