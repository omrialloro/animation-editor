import { isSubset} from "./Utils";


let scheme1 =  ['#171616', '#B51F1F','#cb4406','#F3F1E0', '#cb9d06','#065684']

let scheme2  = ['#ff0000','#0000ff','#FFFFFF','#000000','#FFFF00','FF00FF']

let scheme3  = ['#28b7ce', '#21c17c', '#e27940','#1f286d','#dd6cb8', '#f2e672']

let scheme4  = ['#4ba8e2','#0b22b6', '#919191', '#2d2d2d', '#ffffff', '#f21449']
 
function getAllColors(frames){
    let colors = []
    frames.forEach(frame => {
      frame.forEach(row => {
        row.forEach(x => {
          if(!colors.includes(x)){
            colors.push(x)
          } 
        });
      });
    });
    return colors
  }

  function prepareSchemeMapping(s1,s2){
    let schemeMap = {}
    for(let i =0;i<s1.length;i++){
      schemeMap[s1[i]]=s2[i]
    }
    return schemeMap
  }

function detectScheme(frames){
    let colors = getAllColors(frames)
    if(isSubset(colors, scheme1)){
      return [1,scheme1]
    }
    if(isSubset(colors, scheme2)){
      return [2,scheme2]
    }
    if(isSubset(colors, scheme3)){
      return [3,scheme3]
    }
    if(isSubset(colors, scheme4)){
      return [4,scheme4]
    }
    return [0,{}]
  }

  function changeFrameColors(frame,schemeMap){
    return frame.map((v)=>(v.map((x)=>(schemeMap[x]))))
  }

function changeFrameScheme(frames, schemeY){
  let [ind,schemeX] = detectScheme(frames)
  let mapping =  prepareSchemeMapping(schemeX,schemeY)
  return frames.map((frame)=>(changeFrameColors(frame,mapping)))
}

let schemes_array = [scheme1, scheme2,scheme3,scheme4]
function getSchemesArray(){return [scheme1, scheme2,scheme3,scheme4]}


export  {changeFrameScheme, getSchemesArray}