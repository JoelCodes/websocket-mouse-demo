var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');
var _ = require('lodash');

new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    }
  })
  .listen(3000, '0.0.0.0', function (err, result) {
    if (err) {
      console.log(err);
    }

    console.log('Running at http://0.0.0.0:3000');
  });

// server.js

const express = require('express');
const WebSocket = require('ws');


// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new WebSocket.Server({ server });

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.

var index = 0; // Running Id
var points = {}; // Object of current points.

// When a socket connects
wss.on('connection', (ws) => {

  // Set their id to a new integer
  ws.id = index++;

  // Create a new point
  points[ws.id] = {x: 0, y: 0};
  console.log('Client connected', ws.id);

  // Send the client a "Connect" event so that they know their own id.
  ws.send(JSON.stringify({type: "Connect", id: ws.id}))

  // This sends everyone an updated list of which points are available and
  // where they're located
  function sendPointsToClients(){
    const pointIds = Object.keys(points);

    const pointsData = pointIds.map(pointId => {
      const {x, y} = points[pointId];
      return {pointId, x, y}
    });

    wss.clients.forEach((client) => {
      if(client.readyState === WebSocket.OPEN){
        client.send(JSON.stringify({type: 'Points', points: pointsData }));
      }
    });
  }
  // Since someone has joined, update
  sendPointsToClients();

  // This is a debounced function to update the position on the local store
  // It waits until it has received no data for at least 250ms.
  // https://lodash.com/docs/4.17.4#debounce
  const updatePointEventually = _.debounce((x, y) => {
    points[ws.id].x = x;
    points[ws.id].y = y;
  }, 250)

  ws.on('message', (data) => {
    const parsed = JSON.parse(data);
    parsed.pointId = ws.id.toString();
    parsed.type = "Move";
    updatePointEventually(parsed.x, parsed.y);
    console.log('Client Message', parsed);
    // No sense re-sending the same message to the one who sent it.
    sendMessageToAllClientsExcept(ws, JSON.stringify(parsed));
  });


  // Set up a callback for when a client closes the socket. 
  // This usually means they closed their browser.
  ws.on('close', () => {
    console.log('Client disconnected')
    delete points[ws.id];
    sendPointsToClients();
  });
});

function sendMessageToAllClientsExcept(me, message){
  wss.clients.forEach((client) => {
    if(client !== me && client.readyState === WebSocket.OPEN){
      client.send(message);
    }
  });
}