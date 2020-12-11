//
// HELPERS
//

// TEMPLATE
const template = document.createElement("template");
template.innerHTML = `
    <style>
      :host {
        display: inline-block;
      }
      
      .image-container {
          height:100px;
          width:100px;
      }
      .image-container img {
        width:100%;
        height:100%;
      }


      .lobby-container {
        display: flex;
        flex-direction: column;
        /* height: 100%; */
        padding: 2rem;
        margin: 0 auto;
        max-width: 600px;
    
    
        box-shadow: 0px 0px 0px rgba(169, 166, 166, .4);
        background: rgba(255, 255, 255, 0);
        transition: all 400ms ease;
    }
    
    .lobby-container:hover {
        box-shadow: 2px 1px 10px rgba(169, 166, 166, .4);
        background: rgba(255, 255, 255, 0.23);
    }

    .avatar-button-group {
        display:flex;
    }

    .avatar-button {
        margin:0.5rem;
        flex-grow:0;
        flex-shrink:0;
        padding:0;
        height:75px;
        width:75px;
        border-radius:50%;
        overflow:hidden;
        border: none;
        outline:none;
        background: none;
        cursor: pointer;
        transition: transform 150ms ease;
        border:3px solid #FFF;
    }

    .avatar-button:hover {
        transform: scale(1.1);
    }

    .avatar-button img {
        object-fit:cover;
        width:100%;
        height:100%;
    }

    </style>
    <div class="lobby-container">
      <h3>Select user to join chat room</h3>
      <div class="avatar-button-group">
       
      </div>

    </div>
`;

window.customElements.define(
  "chat-lobby",
  class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
      /* this.attachShadow({ mode: "open" });
      const lobbyNode = template.content.cloneNode(true);

      this.updateAvatars = this._updateAvatars.bind(this);

      this.shadowRoot.appendChild(lobbyNode);
      console.log("this.shadowRoot:", this.shadowRoot); */
      //this._updateAvatars();
    }

    disconnectedCallback() {
      const btnGroup = this.shadowRoot.querySelector(".avatar-button-group");
      //ADD LISTENERS
      this.shadowRoot
        .querySelectorAll(".avatar-button-group")
        .forEach((btn) => {
          btn.addEventListener("click", this._userSelected.bind(this));
        });
    }

    _updateAvatars() {
      console.log("this:", this.shadowRoot);
      const btnGroup = this.shadowRoot.querySelector(".avatar-button-group");

      btnGroup.querySelectorAll("*").forEach((n) => n.remove());
      this._avatars.forEach((user) => {
        //create button
        const avatarBtn = document.createElement("button");
        avatarBtn.classList.add("avatar-button");
        btnGroup.appendChild(avatarBtn);
        //create avatar image
        const avatarImg = document.createElement("img");
        avatarImg.setAttribute("src", user.image_src);
        avatarImg.setAttribute("data-value", user.name);
        avatarBtn.appendChild(avatarImg);
      });

      //ADD LISTENERS
      this.shadowRoot
        .querySelectorAll(".avatar-button-group")
        .forEach((btn) => {
          btn.addEventListener("click", this._userSelected.bind(this));
        });
    }

    //
    // EVENT HANDLERS
    //

    _userSelected(e) {
      console.log("_userSelected.e:", e.target.getAttribute("data-value"));
      this.dispatchEvent(
        new CustomEvent("user_selected", {
          bubbles: true,
          composed: true,
          detail: { user: { username: e.target.getAttribute("data-value") } },
        })
      );
    }

    //
    // SETTERS AND GETTERS
    //
    /**
    * This is a setter which lobby avatars
    @param list - array of { name:string, image_src:string }

    */
    set avatars(list) {
      console.log("this:", this);
      this._avatars = list;
      this._updateAvatars();
    }
  }
);
