//
// SOCKET.IO METHODS
//
const joinRoom = (socket, username) => {
  return new Promise((resolve, reject) => {
    socket.once("connect", () => {
      socket.emit("SET_USERNAME", username);
      resolve(true);
    });
    socket.connect();
  });
};

// Listen for DOM to load, before setting up
document.addEventListener("DOMContentLoaded", async () => {
  console.log("DOMContentLoaded:");

  // SOCKET.IO
  const socket = io({
    autoConnect: false,
  });
  socket.on("connect", function () {
    console.log("connected");
  });

  await joinRoom(socket, "userA");
  console.log("joined");
});
