// import { createContext, useState } from "react";

// const RangeContext = createContext();
// const [range, setRage] = useState([0,0])

// function RangeContextProvider(props){
//     const context = {}
//     return <RangeContext.Provider value = {{range}}>
//         {props.children}
//     </RangeContext.Provider>

// }
// export default RangeContextProvider;

import React from 'react'
const RangeContext = React.createContext([0,0])
export const RangeContextProvider = RangeContext.Provider
export default RangeContext