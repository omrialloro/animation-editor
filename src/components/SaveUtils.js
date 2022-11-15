

async function saveSession(name, data, port){
    fetch(port + '/saveSession', {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({"filename":name,"data": data}),
    })
}


async function loadSession(port){
    // let fn_list = await fetch(port+`/api/sessions`, {method: 'GET' }).then(res => res.json())
    // const session_name = window.prompt("Enter session name from the following list   " + fn_list);
    const session_name = window.prompt("Enter session name from the following list" );

    let data = await fetch(port + `/loadSession/${session_name}`, {method: 'GET' }).then(res => res.json())
    return data
}

function extractToGif(port, frames, time_ms){
  const prefix = window.prompt("enter gif name")
  let name = prefix+String(Date.now())
  let data = {"name":name,"speed":Math.round(time_ms),"data": frames,"save_animation":false}
  fetch(port + '/gif', {
    method: 'POST', // or 'PUT'
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  let aaa =  document.createElement(`a`);
  aaa.href = port+`/download/${name}`
  aaa.click()
}

export {saveSession,loadSession, extractToGif}