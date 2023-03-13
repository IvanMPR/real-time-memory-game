const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const path = require('path');
// --------------------------------------------- //
const app = express();
const server = http.createServer(app);
const io = socketio(server);
// --------------------------------------------- //
// static folder
app.use(express.static(path.join(__dirname, 'public')));
// --------------------------------------------- //

// --------------------------------------------- //
const PORT = 3000 || process.env.port;
server.listen(PORT, () => console.log(`Listening on ${PORT}`));
