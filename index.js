const express = require('express');
const fs = require('fs');
const http = require('http')
const WebSocket = require('ws')
// const url = require('url');

const app = express.Router();

const server = http.createServer();
const wss = new WebSocket.Server({ noServer: true });

function send(ws, data) {
  let buffer = Buffer.from(JSON.stringify(data))
  ws.send(buffer.toString('binary'))
}

wss.on('listening', () => {

})

wss.on('connection', function connection(ws) {
  ws.on('message', (message) => {
    // if(message.match(/ping/ig))return send(ws, {type:'ping',message:true})
    console.log(message.toString())
    console.log(`Recieved: ${JSON.parse(message).event}`)
    console.log(Array.isArray(JSON.parse(message)), JSON.parse(message))
    send(ws, { type: 'akn', message: true })
  })
  console.log(fs.readFileSync(__dirname + '\\display.json', { encoding: 'utf-8' }))
  send(ws, { type: 'connection', message: true })
  send(ws, { type: 'info', message: 'Connected Successfully to DK EDTracker Server' })
  send(ws, { type: 'page', message: fs.readFileSync(__dirname + '\\display.json', { encoding: 'utf-8' }) })
  send(ws, { type: 'info', id: 'ver', message: `Version: ${require('./package.json').version}` })
  ws.on('ping', data => {
    ws.pong('Server Ping')
    console.log("PONG: "+data.toString())
  })

});
wss.on('close', (ws) => {
  console.log("Closed")
})


server.on('upgrade', function upgrade(request, socket, head) {

  /*request.headers: {
  apikey: 'hehe',
  upgrade: 'websocket',
  connection: 'Upgrade',
  'sec-websocket-version': '13',
  'sec-websocket-key': 'yP3EHNCqO5MJ8LtX0EK0DQ==',
  host: '93.209.182.217:65535',
  'sec-websocket-protocol': 'ed-tracker',
  origin: 'ED-Tracker-Client'
},*/

  const headers = request.headers;

  if (headers.apikey === 'hehe') {
    wss.handleUpgrade(request, socket, head, function done(ws) {
      wss.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});

server.listen(8080);

module.exports = app;