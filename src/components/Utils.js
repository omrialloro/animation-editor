function isSubset(sub, set){
    return Boolean(sub.map((x) => set.includes(x)).reduce((p,c)=>p*c))
}

function nestedCopy(array) {
    return JSON.parse(JSON.stringify(array));
}

export  {nestedCopy,isSubset}