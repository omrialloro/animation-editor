

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

export {saveSession,loadSession}