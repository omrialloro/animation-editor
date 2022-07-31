import React from "react";

export default  React.forwardRef((props,ref) =>{

  
  const [source, setSource] = React.useState();
  const [isPlay, SetIsPlay] = React.useState(false);
  const [fff, setFile] = React.useState();


  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFile(file)
    const url = URL.createObjectURL(file);
    setSource(url);
  };

//   useEffect(()=>{
//     async function  loadFilenames(){
//       let dd = await fetch(port + `/api/`, {method: 'POST' }).then(res => res.json())
//       setFilenames(dd)
//     }
//     loadFilenames()
//   },[])

  const { ref1, ref2 } = ref.current;

  // let  I= 0
  function TogglePlay(){
    let Audio = document.querySelector(".AudioInput_audio");

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
      <input
        ref={ref1}
        className="AudioInput_input"
        type="file"
        onChange={handleFileChange}
        accept=".wav,.m4a,.mp3,.mp4"
        hidden={true}
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
    </div>
  );
})
