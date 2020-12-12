import EventBus from "./lib/event-bus.js";

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

const initRoomLobby = (state, socket) => () => {
  const mainEl = document.querySelector("main");
  const chatLobbyEl = document.createElement("chat-lobby");
  chatLobbyEl.avatars = config.users;

  const userSelectedHandler = async (e) => {
    await joinRoom(socket, e.detail.user);
    state.username = e.detail.user.username;
    socket.emit("MESSAGE", `${e.detail.user.username} joined chat room!`);
    //
    mainEl.querySelector("chat-lobby").remove();
    window.EventBus.dispatchEvent("user_joined");
  };
  chatLobbyEl.addEventListener("user_selected", userSelectedHandler);
  mainEl.appendChild(chatLobbyEl);

  console.log('window.EventBus.dispatchEvent."user_joined"');
};

const sendChatMessage = (socket) => (text) => {
  socket.emit("MESSAGE", text);
};

const addMessageToList = (state, messageList) => (payload) => {
  console.log("addMessageToList.state:", state);
  console.log("addMessageToList.payload", payload);

  const { username, timestamp, text } = payload;
  var linkExtractorRE = /(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/gi;

  const newMessage = {
    username,
    timestamp,
    self: state.username === username,
    text: text.replace(linkExtractorRE, "*link*"),
    urls: text.match(linkExtractorRE),
  };

  console.log("newMessage:", newMessage);
  state.messages.push(newMessage);
  messageList.addMessage(newMessage);
};

const initChatArea = (state, socket) => () => {
  const mainEl = document.querySelector("main");
  const chatAreaEl = document.createElement("chat-area");
  chatAreaEl.avatars = config.users;
  console.log("chatAreaEl:", chatAreaEl);
  mainEl.appendChild(chatAreaEl);

  const msg1 = {
    username: "user_a",
    urls: [],
    timestamp: Date.now(),
    text:
      "connectedCallback() fires when the element is inserted into the DOM. https://i.imgur.com/Q6pAkWlb.jpg https://i.imgur.com/Jt9fyBZb.jpg",
  };

  const msg2 = {
    username: "user_a",
    urls: [],
    timestamp: Date.now(),
    text:
      "If that’s you, you’ll probably need to @import whatever global stylesheets you can to bring in those global styles and hope t.",
  };
  const msg3 = {
    username: "user_b",
    urls: [],
    timestamp: Date.now(),
    text: "connectedCallback() fires when the element is ",
  };
  const msg4 = {
    username: "user_b",
    self: true,
    urls: [],
    timestamp: Date.now(),
    text:
      "connectedCallback() fires when the element is inserted into the DOM. It's a good place to set the initial role, tabindex, internal state, and install event listeners.",
  };

  setTimeout(() => addMessageToList(state, chatAreaEl)(msg1), 500);
  setTimeout(() => addMessageToList(state, chatAreaEl)(msg2), 2000);
  setTimeout(() => addMessageToList(state, chatAreaEl)(msg2), 3500);
  setTimeout(() => addMessageToList(state, chatAreaEl)(msg4), 4500);
};

const receiveChatMessage = (state) => (payload) => {
  const chatAreaEl = document.querySelector("chat-area");
  // chat area might not be in the dom before user has joined
  if (chatAreaEl) {
    addMessageToList(state, chatAreaEl)(payload);
  }
};

// Listen for DOM to load, before setting up
document.addEventListener("DOMContentLoaded", async () => {
  window.EventBus = new EventBus();

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

  // LOBBY SETUP
  await initRoomLobby(state, socket)();

  //
  // EVENT HANDLERS
  //

  // Socket event handlers
  socket.on("connect", () => console.log("connected"));
  socket.on("MESSAGE", receiveChatMessage(state));

  // Event bus handlers
  window.EventBus.addEventListener("user_joined", () => {
    //CHAT SETUP
    initChatArea(state, socket)();
  });

  window.EventBus.addEventListener("open_settings", () => {
    console.log("open_settings:");
  });

  window.EventBus.addEventListener("send_message", (e) => {
    //console.log("send_message:", e.detail.text);
    sendChatMessage(socket)(e.detail.text);
  });
});
