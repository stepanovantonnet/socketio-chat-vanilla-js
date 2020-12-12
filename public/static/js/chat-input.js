//
// HELPERS
//
const resizeHandler = (textarea) => () => {
  textarea.style.height = "auto";
  textarea.style.height = textarea.scrollHeight + "px";
};
const delayedResizeHandler = (textarea) => () =>
  setTimeout(resizeHandler(textarea), 0);

const emojiStringToArray = (str) => {
  const split = str.split(/([\uD800-\uDBFF][\uDC00-\uDFFF])/);
  const arr = [];
  for (var i = 0; i < split.length; i++) {
    const char = split[i];
    if (char !== "") {
      arr.push(char);
    }
  }
  return arr;
};

//
// DEFINE TEMPLATE
//
const template = document.createElement("template");
template.innerHTML = `
    <style>
        :host {
          display: flex;
          padding: 1rem;
          background-color: #FFF;
        }
        textarea {
          line-height:40px;
          font-size:20px;
          font-family: 'Quicksand', sans-serif;
          flex:1;
          resize:none;
          overflow-y: hidden;
          border: 0 none white;
          padding: 0;
          outline: none;
         /*  background-color: #D0D0D0; */
          background-color: #FFF;
        }
  
        .send-button-container {
            display: flex;
            align-items:center;
            justify-content:center;
        }
  
        .centerThings {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }
        
        button {
          
          height: 40px;
          width: 40px;
          border: none;
          outline:none;
          background: none;
          cursor: pointer;
        }
        button svg {
          outline: none;
          transition: transform 0.15s linear;
        }
  
        button:hover svg {
            transform: scale(1.1);
        }
  
        .emoji-button-container {
            position:relative;
        }
  
        #tooltip {
          background: #FFF;
          color: white;
          font-weight: bold;
          padding: 8px 8px;
          font-size: 20px;
          border-radius: 4px;
          display: none;
          /* display:flex; */
        }
  
        #tooltip[data-show] {
          display:flex;
        }
  
        #arrow,
        #arrow::before {
          position: absolute;
          width: 8px;
          height: 8px;
          z-index: -1;
        }
  
        #arrow::before {
          content: "";
          transform: rotate(45deg);
          background: #FFF;
        }
        #tooltip[data-popper-placement^="top"] > #arrow {
          bottom: -4px;
        }
  
        #tooltip[data-popper-placement^="bottom"] > #arrow {
          top: -4px;
        }
  
        #tooltip[data-popper-placement^="left"] > #arrow {
          right: -4px;
        }
  
        #tooltip[data-popper-placement^="right"] > #arrow {
          left: -4px;
        }
  
      </style>
      <textarea rows="1" placeholder="Write something..."></textarea>
      <div class="emoji-button-container">
          <div id="tooltip" role="tooltip">
              <button>
              😊
              </button>
              <button>
              😉
              </button>
             
              <div id="arrow" data-popper-arrow></div>
          </div>
          
      </div>
      <div class="send-button-container">
          <button id="emoji-button">
              <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="smile" class="svg-inline--fa fa-smile fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"><path fill="#b3bec9" d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 448c-110.3 0-200-89.7-200-200S137.7 56 248 56s200 89.7 200 200-89.7 200-200 200zm-80-216c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm4 72.6c-20.8 25-51.5 39.4-84 39.4s-63.2-14.3-84-39.4c-8.5-10.2-23.7-11.5-33.8-3.1-10.2 8.5-11.5 23.6-3.1 33.8 30 36 74.1 56.6 120.9 56.6s90.9-20.6 120.9-56.6c8.5-10.2 7.1-25.3-3.1-33.8-10.1-8.4-25.3-7.1-33.8 3.1z"></path></svg>
          </button>
          <button id="send-button">
              <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="paper-plane" class="svg-inline--fa fa-paper-plane fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#4facfe" d="M440 6.5L24 246.4c-34.4 19.9-31.1 70.8 5.7 85.9L144 379.6V464c0 46.4 59.2 65.5 86.6 28.6l43.8-59.1 111.9 46.2c5.9 2.4 12.1 3.6 18.3 3.6 8.2 0 16.3-2.1 23.6-6.2 12.8-7.2 21.6-20 23.9-34.5l59.4-387.2c6.1-40.1-36.9-68.8-71.5-48.9zM192 464v-64.6l36.6 15.1L192 464zm212.6-28.7l-153.8-63.5L391 169.5c10.7-15.5-9.5-33.5-23.7-21.2L155.8 332.6 48 288 464 48l-59.4 387.3z"></path></svg>
          </button>
      </div>
    <div>
  `;

class ChatInput extends HTMLElement {
  static get observedAttributes() {
    return ["keysend"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.onSendClick = this._onSendClick.bind(this);
    this.onEmojiClick = this._onEmojiClick.bind(this);
  }

  //
  // LIFECYCLE
  //
  connectedCallback() {
    this.textarea = this.shadowRoot.querySelector("textarea");
    this.textarea.addEventListener("change", resizeHandler(this.textarea));
    this.textarea.addEventListener(
      "paste",
      delayedResizeHandler(this.textarea)
    );
    this.textarea.addEventListener(
      "keydown",
      delayedResizeHandler(this.textarea)
    );
    this.textarea.addEventListener("keydown", this._onKeyDown.bind(this));

    this.shadowRoot
      .getElementById("send-button")
      .addEventListener("click", this.onSendClick);

    this.shadowRoot
      .getElementById("emoji-button")
      .addEventListener("click", this.onEmojiClick);

    const button = this.shadowRoot.getElementById("send-button");
    console.log("button:", button);
  }

  disconnectedCallback() {
    this.textarea.removeEventListener("change", resizeHandler(this.textarea));
    this.textarea.removeEventListener(
      "paste",
      delayedResizeHandler(this.textarea)
    );
    this.textarea.removeEventListener(
      "keydown",
      delayedResizeHandler(this.textarea)
    );
    this.textarea.removeEventListener("keydown", this._onKeyDown.bind(this));

    this.shadowRoot
      .getElementById("send-button")
      .removeEventListener("click", this.onSendClick);

    this.shadowRoot
      .getElementById("emoji-button")
      .removeEventListener("click", this.onEmojiClick);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    const hasValue = newValue !== null;
    switch (name) {
      case "keysend":
        this.setAttribute("aria-keysend", hasValue);
        break;
    }
  }

  //
  // PRIVATE METHODS
  //
  _send() {
    const text = this.textarea.value;
    //don't send empty msgs
    //TODO disable send btn
    if (text.length > 0) {
      window.EventBus.dispatchEvent("send_message", {
        text,
      });
    }
  }

  _clear() {
    this.textarea.value = "";
  }

  //
  // HANDLERS
  //
  _onEmojiClick() {
    const emojis = emojiStringToArray("😊🥺😉😍😘😚😜😂😝😳😁😣😢😭😰🥰");
    const rndEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    window.EventBus.dispatchEvent("send_message", {
      text: rndEmoji,
    });
    this._clear();
  }
  _onSendClick() {
    this._send();
    this._clear();
  }

  _onKeyDown(e) {
    const sendCmdDetected =
      this.keysend === "true" &&
      e.composed &&
      (e.ctrlKey || e.metaKey) &&
      e.keyCode === 13;
    if (sendCmdDetected && this.textarea.value.length > 0) {
      this._send();
      this._clear();
    }
  }

  //
  // SETTERS AND GETTERS
  //
  set keysend(value) {
    this.setAttribute("keysend", value);
  }

  get keysend() {
    return this.getAttribute("keysend");
  }
}

window.customElements.define("chat-input", ChatInput);
