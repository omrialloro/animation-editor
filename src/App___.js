

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


import  {reflectFrame,rotateFrame} from "./components/frameTransformations";




let schemes_array = getSchemesArray()


// todo: change range when picked v
//      change monitor when dragged v
//      duplicate v
//      show animation name in toolbar v
//      cash animation v
//      reflect rotate reverse v
//      change scheme v
//      upload music v
//      implementing forwardRef v
//      render first frame each change
//      make scroll change frames
//     ----- fix setInterval -----v
//      call server to extract gif
//      improve slider response


//  להתחיל עם הרבה אנימציות מההיבות ותוכנת עריכה. להוסיף סכימות
//   יצירות אמנות איזולירבנד

  const StyledWindow= styled.div`
  width: 96px;
  height: 96px;
  margin-right: 4px;
  border: ${(props)=>props.border}px solid #000;
`;

const StyledMonitor= styled.div`
width:480px
height:480px


border: 2px solid #000;
margin: 24px;
z-index: 7;

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

const StyledContainer= styled.div`
height: 48px;
width: 48px;
position: relative;
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
    console.log("updateRange")

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
    console.log(OutScreen)

  },[mainScreen,DATA])
let frammmes = prepareFrames(mainScreen)

let i = 0;
const [isRunning, setIsRunning] = useState(false)

UseInterval(() => {
  i+=1;
  if (i>=frammmes.length-1){
    i=0
  }
  inputRef2.current(frammmes[i])
  inputRef1.current(frammmes[i])
  inputRef3.current(frammmes[i])

}, isRunning?delay:null);

function togglePlay(){
  setIsRunning(!isRunning)
}


return (
<body>

<DragDropContext  onDragStart={handleOnDragStart} onDragEnd={handleOnDragEnd}>
<Droppable droppableId="droppable" direction="horizontal">
    {(provided) => {return (

<main {...provided.droppableProps} ref={provided.innerRef}>
  <div className="container_left">
    <div className="inner_container_left">
    <div className="container_monitor">
    <div className="monitor">
                            {/* <StyledContainer className="monitor"> */}
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
                            {/* <StyledMonitor> */}
                                <Screen ref = {inputRef2}
                              id = "tt" data = {mainScreen} prepareFrames={prepareFrames} isPlay = {true} vp_percent = {31} delay = {32} DefaultFrame ={frammmes[0]}/>
                            {/* </StyledMonitor> */}
                            {/* </StyledContainer> */}

        {/* {provided.placeholder} */}
        </div>
        <div className="slide_monitor">
        <SliderComp min={ScreenRange["min"]} max = {ScreenRange["max"]} range = {range} updateRange  = {updateRange} width = {340}/>
        </div>
        </div>
        <div className="container_btns">    
    <div className="container_btn invert">
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

    <div className="container_btn flip_vert">
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

 <AudioInput ref = {inputRef} start_sec={offset} stop_sec={offset+len_sec}></AudioInput>

      <div className="add_music" onClick={handleChoose}>
            <p>add music</p>
      </div>
      <div className="download" onClick={()=>console.log(setRange)}>
            <p>download</p>
      </div>
      <div className="download" onClick={togglePlay}>
            <p>play</p>
      </div>
      <input value={offset} onChange={handleOffsetChange} />
      <input value={duration} onChange={handleDurationChange} />
      <div className="library" >
        <form action="/action_page.php">
              <select name="schemes" id="scheme"  onChange={handleSelectChange}>
                {filenames.map((f)=>(<option>{f}</option>))}
              </select>
        </form>
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
                             <Screen ref = {inputRef3}  id = {"tt"+k["id"]} data = {k} prepareFrames={prepareFrames} isPlay = {true} vp_percent = {9} delay = {30} DefaultFrame = {prepareFrames(k)[1]}/>
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
              <Screen ref = {inputRef1} id = {"tdfffff"} data = {OutScreen} prepareFrames={prepareFrames} isPlay = {true} vp_percent = {52} delay = {delay} DefaultFrame = {frammmes[9]}/>

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
