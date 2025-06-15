import { OutgoingMessage, SupportedMessage as OutgoingSupportedMessages } from "./messages/outgoingMessages";
import {server as WebSocketServer, connection} from "websocket" // why websocket in real time chat application whenever we are are doing real time communication or more specifically when two people are communicating with each other in real time, we need to have a persistent connection between the client and the server. This is where WebSockets come into play. WebSockets allow for full-duplex communication channels over a single TCP connection, enabling real-time data transfer without the overhead of HTTP requests. we can do this also http long polling but it is not efficient and it is not real time. WebSockets are more efficient and provide a better user experience. In this example we will use WebSockets to create a real time chat application. We will use the ws library to create a WebSocket server and the socket.io library to create a WebSocket client. We will also use the express library to create a web server to serve the client files. // first we are going to create a WebSocket server using the ws library. We will create a simple server that listens for incoming connections and broadcasts messages to all connected clients.
import http from 'http';
import { UserManager } from "./UserManager";
import { IncomingMessage, SupportedMessage } from "./messages/incomingMessages";

import { InMemoryStore } from "./store/InMemoryStore";

const server = http.createServer(function(request: any, response: any) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});

server

const UserManager = new UserManager();
const store = new InMemoryStore();

const store = new InMemoryStore();

server.listen(8080, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});

const wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

function originIsAllowed(origin: string) {
  return true;
}

wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }
    
    var connection = request.accept('echo-protocol', request.origin);
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            try {
                messageHandler(connection,JSON.parse(message.utf8Data));
            } catch (e) {

            }
            // console.log('Received Message: ' + message.utf8Data);
            // connection.sendUTF(message.utf8Data);
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

function messageHandler(ws: connection, message: IncomingMessage) {
    if (message.type == SupportedMessage.JoinRoom){
        const payload = message.payload;
        UserManager.addUser(payload.name, payload.userId, payload.roomId, ws);
    }

    if (message.type == SupportedMessage.SendMessage) {
        const payload = message.payload;
        const user = UserManager.getUser(payload.roomId, payload.userId);
        
        if (!user) {
            console.error("User not found in the db");
            return;
        }
        let chat = store.addChat(payload.userId, payload.roomId, payload.message);
        if (!chat) {
            return;
        }

        const outgoingPayload: OutgoingMessage = {

        }
    }

    if (message.type === SupportedMessage.UpvoteMessage) {
        const payload = message.payload;
        store.upvote(payload.userId, payload.roomId, payload.chatId);
    }
}