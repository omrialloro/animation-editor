const http = require('http')
const os = require('os')
const path = require('path')
const express = require('express')
const fs = require('fs')
const PNG = require('pngjs').PNG;


app = express()

app.use(express.json({limit: '25mb'}));

app.use(express.static('public'))
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
})

app.listen(5000)
console.log("listening to port 5000")

app.get('/check',function (req,res){
  console.log("running")
  res.send("ok")
}
)

function getData(){
  files = fs.readdirSync(__dirname+'/animations')
  let data = [];
  files.forEach(file => {
    if (file!='.DS_Store'){
      console.log(file)
      var a = fs.readFileSync('animations/'+file)
      data.push(JSON.parse(a))

    }

  })
    return data
}


app.get('/data', function (req, res) {
  res.send(getData())
})
