
import "./../components/App.css";
import "./../components/base.css";
import './../components/fonts.css';

import {changeFrameScheme, getSchemesArray,detectScheme} from "./../components/ColorSchemes";


import styled from "styled-components";

const scheme_array = getSchemesArray()

const StyledScheme= styled.div`
  margin: 0 auto;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  box-sizing: border-box;
  border-width: 5px;
  border-style: solid;
  border-color:${(props)=>props.scheme};
`;
export function Operators(props) {

  const operatorsState = props.operatorsState;
  const updateOperatorsState = props.updateOperatorsState;
  console.log(operatorsState)


  function clickRotate(){
    let operatorsState_ = operatorsState
    operatorsState_["rotate"] = (operatorsState_["rotate"]+1)%4
    updateOperatorsState(operatorsState_)
  }

  function clickReverse(){
    let operatorsState_ = operatorsState
    operatorsState_["reverse"] = (operatorsState_["reverse"]+1)%2
    updateOperatorsState(operatorsState_)
  }

  function clickReflect(){
    let operatorsState_ = operatorsState
    operatorsState_["reflect"] = (operatorsState_["reflect"]+1)%2
    updateOperatorsState(operatorsState_)
  }

  function clickScheme(){
    let operatorsState_ = operatorsState
    if (operatorsState_["scheme"]==-1){
      return
    }
    else {
      operatorsState_["scheme"] = (operatorsState_["scheme"]+1)%4
      updateOperatorsState(operatorsState_)
    }
  }

  let scheme_index = operatorsState["scheme"]
  console.log(scheme_index)
  console.log(scheme_index)
  console.log(scheme_index)
  console.log(scheme_index)
  console.log(scheme_index)

  let scheme = scheme_index==-1?"black":scheme_array[scheme_index].slice(2,6).join(' ')


  return(
    <div className="container_btns">  

      <div className="container_btn invert" onClick={clickReverse}>
        <div className="btn">
          <img src="reverse_icon.svg"></img>
        </div>
        <p>{"reverse" +operatorsState["reverse"]} </p>
      </div>

      <div className="container_btn reflect" onClick={clickReflect}>
        <div className="btn">
          <img src="reflect_icon.svg"></img>
        </div>
        <p>{"reflect"+operatorsState["reflect"]}</p>
      </div>

      <div className="container_btn flip_vert" onClick={clickRotate}>
        <div className="btn">
          <img src="switch_icon.svg"></img>
        </div>
        <p>{"rotate"+operatorsState["rotate"]}</p>
      </div>

      <div className="container_btn color_scheme" onClick={clickScheme}>
        <div className="btn" >
          <StyledScheme scheme = {scheme}></StyledScheme>
        </div>
        <p>{"scheme"+operatorsState["scheme"]}</p>
      </div>

    </div>
  )
}
