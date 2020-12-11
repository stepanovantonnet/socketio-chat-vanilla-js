const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const path = require("path");

//  CREATE APPS
const app = express();
const server = http.createServer(app);
const io = socketio(server);

//  SOCKET.IO handlers

// handle connection
io.on("connection", (socket) => {
  // set username and
  // place all users into "room1"
  socket.on("SET_USERNAME", (username) => {
    console.log("username:", username);
    socket.username = username;
    socket.join("room1");
    io.to("room1").emit("USER_JOINED", socket.username);
  });

  // get message received form the users
  // add username and timestamp
  // emit broadcast message to everyone

  socket.on("MESSAGE", function (msg) {
    io.emit("MESSAGE", {
      username: this.username,
      timestamp: Date.now(),
      text: msg,
    });
  });
});

// EXPRESS STATIC ROUTES
app.use("/", express.static(path.resolve(__dirname, "public")));
app.get("/*", (req, res) => res.sendFile(__dirname + "/public/index.html"));

//  START SERVER
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`listening on *:${port}`);
});
