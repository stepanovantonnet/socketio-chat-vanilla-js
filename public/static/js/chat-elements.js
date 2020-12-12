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

    .time {
        padding:0.5rem 1rem ;
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
        padding:0.75rem 1rem ;

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
    .avatar {
        flex-grow:0;
        flex-shrink:0;
        height:75px;
        width:75px;
        border-radius:50%;
        overflow:hidden;
    }
    
    .scale-in-bottom {
        animation-duration: .45s;
        animation-name: fly-in
       /*  animation: fly-in 0.25s cubic-bezier(0.250, 0.460, 0.450, 0.940) both; */
    }
    .scale-in-bottom__ {
        -webkit-animation: scale-in-bottom 0.35s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
                animation: scale-in-bottom 0.35s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
    }

    @keyframes fly-in {
        0% {
          transform: scale(0.85) translateY(10%);
          opacity: 0;
        }
        100% {
          transform: scale(1) translateY(0);
          opacity: 1;
        }
      }

    /* ----------------------------------------------
    * Generated by Animista on 2020-12-10 17:40:49
    * Licensed under FreeBSD License.
    * See http://animista.net/license for more info. 
    * w: http://animista.net, t: @cssanimista
    * ---------------------------------------------- */

    /**
     * ----------------------------------------
     * animation scale-in-bottom
     * ----------------------------------------
     */
    @-webkit-keyframes scale-in-bottom {
    0% {
        -webkit-transform: scale(0);
                transform: scale(0);
        -webkit-transform-origin: 50% 100%;
                transform-origin: 50% 100%;
        opacity: 1;
    }
    100% {
        -webkit-transform: scale(1);
                transform: scale(1);
        -webkit-transform-origin: 50% 100%;
                transform-origin: 50% 100%;
        opacity: 1;
    }
    }
    @keyframes scale-in-bottom {
    0% {
        -webkit-transform: scale(0);
                transform: scale(0);
        -webkit-transform-origin: 50% 100%;
                transform-origin: 50% 100%;
        opacity: 1;
    }
    100% {
        -webkit-transform: scale(1);
                transform: scale(1);
        -webkit-transform-origin: 50% 100%;
                transform-origin: 50% 100%;
        opacity: 1;
    }
    }
    </style>
    <div class="container scale-in-bottom">

        <slot name="username"></slot>

        <div class="avatar">
            <slot name="avatar-image"></slot>
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

      this.isAvatarHidden &&
        (messageCardNode.querySelector(".avatar").style.visibility = "hidden");

      if (this.isSelf) {
        messageCardNode.querySelector(".avatar").style.visibility = "hidden";
        messageCardNode
          .querySelector(".container")
          .classList.add("container__self");
        messageCardNode
          .querySelector(".message-container")
          .classList.add("message-container__self");
      }

      /* if (this.isSelf) {
        this.shadowRoot.appendChild(templateSelf.content.cloneNode(true));
      } else if (this.isAvatarHidden) {
        this.shadowRoot.appendChild(
          templateIncomingNoAvatar.content.cloneNode(true)
        );
      } else {
    } */
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
