//
// HELPERS
//

// TEMPLATE
const template = document.createElement("template");
template.innerHTML = `
    <style>
        :host {
            height: 100%;
            display: flex;
            
            width: 100%;
            max-width: 600px;
            flex-direction:column;
            background: rgba(255, 255, 255, 0.23);
            box-shadow: 2px 1px 10px rgba(169, 166, 166, .4);
        }

        /* WRAP messages  container for responsive and scrollable layout */
        .message-container-wrapper {
            padding: 0 0.5rem;
            flex: 1 1 auto;
            overflow-y: auto;
            height: 0px;
            display: flex;
            flex-direction: column;
        }
        
        .message-container {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
        }

        .app-bar {
            box-sizing:border-box;
            padding:1rem;
            width:100%;
            text-align:right;
        }
        
        button {
            outline:none;
            height: 30px;
            width: 40px;
            border: none;
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
    </style>
    <div class="app-bar">
        <button id="button-open-settings" style="margin-left:auto">
            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="cog" class="svg-inline--fa fa-cog fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#FFF" d="M487.4 315.7l-42.6-24.6c4.3-23.2 4.3-47 0-70.2l42.6-24.6c4.9-2.8 7.1-8.6 5.5-14-11.1-35.6-30-67.8-54.7-94.6-3.8-4.1-10-5.1-14.8-2.3L380.8 110c-17.9-15.4-38.5-27.3-60.8-35.1V25.8c0-5.6-3.9-10.5-9.4-11.7-36.7-8.2-74.3-7.8-109.2 0-5.5 1.2-9.4 6.1-9.4 11.7V75c-22.2 7.9-42.8 19.8-60.8 35.1L88.7 85.5c-4.9-2.8-11-1.9-14.8 2.3-24.7 26.7-43.6 58.9-54.7 94.6-1.7 5.4.6 11.2 5.5 14L67.3 221c-4.3 23.2-4.3 47 0 70.2l-42.6 24.6c-4.9 2.8-7.1 8.6-5.5 14 11.1 35.6 30 67.8 54.7 94.6 3.8 4.1 10 5.1 14.8 2.3l42.6-24.6c17.9 15.4 38.5 27.3 60.8 35.1v49.2c0 5.6 3.9 10.5 9.4 11.7 36.7 8.2 74.3 7.8 109.2 0 5.5-1.2 9.4-6.1 9.4-11.7v-49.2c22.2-7.9 42.8-19.8 60.8-35.1l42.6 24.6c4.9 2.8 11 1.9 14.8-2.3 24.7-26.7 43.6-58.9 54.7-94.6 1.5-5.5-.7-11.3-5.6-14.1zM256 336c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z"></path></svg>
        </button>
    </div>
    <div class="message-container-wrapper">
        <div class="messages-container">
        </div>
    </div>
    <chat-input />
    
`;

window.customElements.define(
  "chat-area",
  class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
      this.messages = [];

      this.onSettingsClick = this._onSettingsClick.bind(this);
    }

    //
    // LIFECYCLE
    //
    connectedCallback() {
      this.shadowRoot
        .getElementById("button-open-settings")
        .addEventListener("click", this.onSettingsClick);
    }

    disconnectedCallback() {
      this.shadowRoot
        .getElementById("button-open-settings")
        .removeEventListener("click", this.onSettingsClick);
    }

    //
    // PUBLIC METHODS
    //
    addMessage(message) {
      const { username, urls, timestamp, text, self } = message;
      const prevMessage = this.messages[this.messages.length - 1];

      this.messages.push(message);

      const msgCard = document.createElement("message-card");
      const hideAvatar = prevMessage && prevMessage.username === username;
      const { image_src } = this._avatarSelector(username);

      hideAvatar && msgCard.setAttribute("hide-avatar", true);

      self && msgCard.setAttribute("self", true);

      if (this.messages.length === 3) {
        msgCard.setAttribute("self", true);
      }

      msgCard.innerHTML = `
           <img 
            slot="avatar-image" 
            style="width:100%;height:100%"
            src="${image_src}" 
           /> 
            <p slot="text">${text}</p>
          `;

      this.shadowRoot.querySelector(".messages-container").appendChild(msgCard);
      msgCard.scrollIntoView({ block: "center", behavior: "smooth" });
    }

    //
    // PRIVATE METHODS
    //

    _avatarSelector(username) {
      console.log("username:", username);
      console.log("this._avatars:", this._avatars);
      return this._avatars.find((a) => {
        console.log("a.name:", a.name);
        return a.name === username;
      });
    }

    //
    // EVENT HANDLERS
    //

    _onSettingsClick() {
      window.EventBus.dispatchEvent("open_settings");
    }

    //
    // SETTERS AND GETTERS
    //
    /**
    * This is a setter which lobby avatars
        @param list - array of { name:string, image_src:string }
    */
    set avatars(list) {
      this._avatars = list;
    }
  }
);
