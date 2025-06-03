// why websocket in real time chat application whenever we are are doing real time communication or more specifically when two people are communicating with each other in real time, we need to have a persistent connection between the client and the server. This is where WebSockets come into play. WebSockets allow for full-duplex communication channels over a single TCP connection, enabling real-time data transfer without the overhead of HTTP requests. we can do this also http long polling but it is not efficient and it is not real time. WebSockets are more efficient and provide a better user experience. In this example we will use WebSockets to create a real time chat application. We will use the ws library to create a WebSocket server and the socket.io library to create a WebSocket client. We will also use the express library to create a web server to serve the client files.


// first we are going to create a WebSocket server using the ws library. We will create a simple server that listens for incoming connections and broadcasts messages to all connected clients.


import {server as WebSocketServer} from "websocket"
import http from 'http';

var server = http.createServer(function(request: any, response: any) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});

server.listen(8080, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});

const wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});

function originIsAllowed(origin: string) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }
    
    var connection = request.accept('echo-protocol', request.origin);
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            connection.sendUTF(message.utf8Data);
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});