import React, { useEffect, useRef } from "react";
import useInterval from './UseInterval'

import SlideBar from "./SlideBar.js"

export default  React.forwardRef((props,ref) =>{
  let ScreenDurationSec = props.durationSec

  const [source, setSource] = React.useState();
  const [isPlay, SetIsPlay] = React.useState(false);
  const [title, setTitle] = React.useState('')
  const [is_music_on, setIsMusicOn] = React.useState(false)
  const [duration, setDuration] = React.useState(1)

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setTitle(file.name)
    const url = URL.createObjectURL(file);
    setSource(url);
    setIsMusicOn(true)
  };

  let refSec = React.useRef()
  let refCentSec = React.useRef()


React.useEffect(() => {
  var au = document.createElement('audio');
  au.src = source;
  au.addEventListener('loadedmetadata', function(){
  setDuration(Math.floor(au.duration))
},false);
}, [source])

  const { ref1, ref2,ref3 } = ref.current;
  const reff = React.useRef()

  function handleChoose(){
    console.log("DFFFFFF")
    reff.current.click();
    console.log(reff.current)
  }

  const offsetRef = React.useRef()

  function setOffset(){
    offsetRef.current.innerText = refSec.current + refCentSec.current/100
  }
  let Audio = document.querySelector(".AudioInput_audio");

  const tuneAudio = ()=>{
    Audio.pause()
    Audio.currentTime = offsetRef.current.innerText
    if(isPlay){
      Audio.play()
    }
  }

  function PlayAudio(){
    Audio.currentTime = offsetRef.current.innerText
    Audio.play()
    setTimeout(() => {
      Audio.pause()
      Audio.currentTime = offsetRef.current.innerText
    }, ScreenDurationSec*1000);
  }

    function TogglePlay(){
    Audio.currentTime = offsetRef.current.innerText
      if(!isPlay){
        Audio.play()
      }
      else{
        Audio.pause()
      }
      SetIsPlay(!isPlay)
  }

  return (
    <div className="AudioInput">
      
<div className="music_section">
          <div className="add_music" onClick={handleChoose}>
          <p> UPLOAD MUSIC</p>
          </div>
          <div className="music_title">
            <p> {title}</p>
          </div>
      </div>
      
      <input
        ref={reff}
        onClick = {()=>console.log("cllllleeeic")}
        className="AudioInput_input"
        type="file"
        onChange={handleFileChange}
        accept=".wav,.m4a,.mp3,.mp4"
        hidden={false}
      />
      {!source && <button  hidden={true}></button>}
      {source && (
        <audio 
          className="AudioInput_audio"
          controls
          src={source}
          hidden="true"
        />
      )}

      <button ref = {ref2} onClick={TogglePlay} hidden = {true}></button>
      <button ref = {ref3} onClick={tuneAudio} hidden = {true}></button>

      <div style={{display:'flex'}}>
        <div className="tuners">
          <SlideBar ref = {refSec} visibility = {is_music_on} min = {0} max = {duration} width = {400} Focus = {setOffset}></SlideBar>
          <SlideBar ref = {refCentSec} visibility = {is_music_on} min = {0} max = {99} width = {400} Focus = {setOffset}></SlideBar>
        </div>
        <p ref = {offsetRef} style={{fontSize: 22}}> 0.0</p>
      </div>
    </div>
    
  );
})
