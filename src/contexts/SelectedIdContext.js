import {useContext, createContext, useState } from "react";

const SelectedIdContext = createContext()
const UpdateSelectedIdContext = createContext()

export function useSelectedId(){
  return useContext(SelectedIdContext)
}


export function useUpdateSelectedId(){
  return useContext(UpdateSelectedIdContext)
}



export function SelectedIdProvider({children}){

  const [selectedId,setSelectedId] = useState(null)
  
  return (<SelectedIdContext.Provider value={selectedId}>
    <UpdateSelectedIdContext.Provider value= {setSelectedId}>
      {children}
    </UpdateSelectedIdContext.Provider>
  </SelectedIdContext.Provider>)


}