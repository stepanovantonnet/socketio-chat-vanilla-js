//
// TEMPLATES
//
const messageCardTemplate = document.createElement("template");
messageCardTemplate.innerHTML = `
    <style>
    .container {
       /*  border:1px dashed red; */
        width:80%;
        /* padding:1rem; */
        display:flex;
    }

    .container__self {
       margin-left:auto;
       justify-content: flex-end;
    }

    .container__self .time {
        text-align:end;
    }

    .time {
        padding:0.5rem 0.5rem ;
        font-size:12px;
        color:grey;
        display:inline-block;
    }
    .username {
        color:grey; 
        display:inline-block;
    }
    .message-body {
        text-align:left;
        margin:0px 16px 16px 16px;
        box-sizing:border-box;
        display:flex;
        flex-direction:column;

    }
    .message-container {
        box-sizing:border-box;
        padding:0.5rem 0.5rem ;

        background: rgb(79,172,254);
        background: linear-gradient(90deg, rgba(79,172,254,1) 0%, rgba(0,200,254,1) 100%);

        font-size:14px;
        color:#FFF;
        border-radius:12px;
        border-top-left-radius:0;
    }

    .message-container__self {
        border-radius:12px;
        border-top-right-radius:0;
        background: #FFF;
        color:#000;
    }

    .image {
        min-height:200px;
        max-height:200px;
        max-width:200px;
    }
    .avatar-container {
        position:relative;
        min-height:75px;
        min-width:75px;
    }
    .avatar-fallback {
        position:absolute;
        height:75px;
        width:75px;
        border-radius:50%;
        color:grey;
        background: #FFF;
        text-align: center;
        line-height: 32px;
        font-weight: 700;
        margin-right: 5px;
        color: #FFFFFF;
        display:flex;
        align-items:center;
        justify-content:center;
    }
    .avatar {
        position:absolute;
        flex-grow:0;
        flex-shrink:0;
        height:75px;
        width:75px;
        border-radius:50%;
        overflow:hidden;
        
    }
   
    
    .message-intro-animation {
        animation-duration: .45s;
        animation-name: message-in
    }

    @keyframes message-in {
        0% {
          transform: scale(0.85) translateY(10%);
          opacity: 0;
        }
        100% {
          transform: scale(1) translateY(0);
          opacity: 1;
        }
      }
    </style>
    <div class="container message-intro-animation">
        <slot name="username"></slot>
        
        <div class="avatar-container">
            <div class="avatar-fallback">
                <slot name="avatar-text"></slot>
            </div>
            <div class="avatar">
                <slot name="avatar-image"></slot>
            </div>
        </div>

        <div class="message-body">
            <span class="time">
                <slot name="time">Time</slot>
            </span>

            <div class="message-container">
                <slot name="image"></slot>
                <slot name="text"></slot>
            </div>
        </div>
    </div>
`;

customElements.define(
  "message-card",
  class extends HTMLElement {
    static get observedAttributes() {
      return ["hide-avatar", "self"];
    }

    constructor() {
      super();
    }

    connectedCallback() {
      this.attachShadow({ mode: "open" });

      const messageCardNode = messageCardTemplate.content.cloneNode(true);

      if (this.isSelf) {
        messageCardNode.querySelector(".avatar-fallback").style.visibility =
          "hidden";
        messageCardNode.querySelector(".avatar").style.visibility = "hidden";
        messageCardNode
          .querySelector(".container")
          .classList.add("container__self");
        messageCardNode
          .querySelector(".message-container")
          .classList.add("message-container__self");
      } else if (this.isAvatarHidden) {
        messageCardNode.querySelector(".avatar-fallback").style.visibility =
          "hidden";
        messageCardNode.querySelector(".avatar").style.visibility = "hidden";
      }
      this.shadowRoot.appendChild(messageCardNode);
    }

    get isAvatarHidden() {
      return this.hasAttribute("hide-avatar");
    }
    get isSelf() {
      return this.hasAttribute("self");
    }
  }
);

//
// MESSAGE IMAGE
//

// Message image template
const imageTemplate = document.createElement("template");
imageTemplate.innerHTML = `
    <style>
      :host {
        display: inline-block;
      }
      
      .image-container {
          height:100px;
          max-width:150px;
          /* width:100px; */
      }
      .image-container img {
        width:100%;
        height:100%;
        object-fit:cover;
      }


    </style>
    <div class="image-container"/>
`;

window.customElements.define(
  "message-image",
  class extends HTMLElement {
    connectedCallback() {
      this.attachShadow({ mode: "open" });
      const imageNode = imageTemplate.content.cloneNode(true);
      const imageContainer = imageNode.querySelector(".image-container");
      const img = document.createElement("img");

      img.setAttribute("src", this.getAttribute("data-src"));
      imageContainer.appendChild(img);
      this.shadowRoot.appendChild(imageNode);
    }
  }
);

//
// MESSAGE TIME
//

/**
 * Datetime formatter helper
 * @param number timestamp
 * @param boolean hour12 should time be AMPM formatted
 */
const parseMessageTime = (timestamp, hour12) => {
  return new Date(parseInt(timestamp, 10)).toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12,
  });
};

// Message time template
const timeTemplate = document.createElement("template");
timeTemplate.innerHTML = `
    <style>
      :host {
        display: inline-block;
      }
      <div>
        <slot name="time">Time</slot>
      </div>
    </style>
`;

window.customElements.define(
  "message-time",
  class extends HTMLElement {
    constructor(props) {
      super();

      this.attachShadow({ mode: "open" });
      const timeNode = timeTemplate.content.cloneNode(true);

      this.variant = this.getAttribute("data-variant");
      this.value = this.getAttribute("data-value");

      this.handleTimeformatChange = this.handleTimeformatChange.bind(this);

      this._render();
    }

    connectedCallback() {
      window.EventBus.addEventListener(
        "change_timeformat",
        this.handleTimeformatChange
      );
    }
    disconnectedCallback() {
      window.EventBus.removeEventListener(
        "change_timeformat",
        this.handleTimeformatChange
      );
    }

    handleTimeformatChange(e) {
      this.isHour12 = e.detail.value === "12h";
      this._render();
    }

    _render() {
      this.shadowRoot.innerHTML = `
            <span slot="time">
                ${parseMessageTime(this.value, this.isHour12)}
            </span>
        `;
    }
  }
);
