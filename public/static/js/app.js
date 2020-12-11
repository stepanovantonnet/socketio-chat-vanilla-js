//
// CONFIG
//

const config = {
  users: [
    {
      name: "user_a",
      image_src: "https://randomuser.me/api/portraits/women/90.jpg",
    },
    {
      name: "user_b",
      image_src: "https://randomuser.me/api/portraits/women/91.jpg",
    },
    {
      name: "user_c",
      image_src: "https://randomuser.me/api/portraits/women/94.jpg",
    },
  ],
};

//
// HELPERS
//

const initSettings = (state) => {
  return Object.fromEntries(
    Object.entries(state).map(([key, defaultValue]) => {
      const value = localStorage.getItem(key) || defaultValue;

      //RADIO GROUPS
      if (key.startsWith("radio")) {
        const el = document.getElementById(key);
        if (el) {
          el.selectedValue = value;
        }
      }
      //SETUP MORE COMPONENTS
      console.log("key:", key);
      if (key === "radio-send-shortcut") {
        const messageInputEl = document.querySelector("message-input");
        if (messageInputEl) {
          messageInputEl.keysend = value;
        }
      }
      //return state key value array
      return [key, value];
    })
  );
  //
  //.reduce((acc, [key,value]) => ({ ...acc, [key]: value }), {});
};

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

  //STATE - INITIAL SETTINGS
  const initialState = {
    "radio-clock-display": "24h",
    "radio-send-shortcut": "true",
  };

  // SETTINGS - INIT
  let state = initSettings(initialState);
  state.messages = [];
  state.username = null;

  // SOCKET.IO
  const socket = io({
    autoConnect: false,
  });
  socket.on("connect", function () {
    console.log("connected");
  });
  
  socket.on("MESSAGE", (payload) => {
    console.log("MESSAGE.payload:", payload);
  });

  //await joinRoom(socket, "userA");
  //console.log("joined");

  // LOBBY SETUP
  const mainEl = document.querySelector("main");
  const chatLobbyEl = document.createElement("chat-lobby");
  chatLobbyEl.avatars = config.users;
  const userSelectedHandler = async (e) => {
    await joinRoom(socket, e.detail.user);
    state.username = e.detail.user.username;
    socket.emit("MESSAGE", `${e.detail.user.username} joined chat room!`);
  };

  chatLobbyEl.addEventListener("user_selected", userSelectedHandler);

  mainEl.appendChild(chatLobbyEl);
});
