const modalTemplate = document.createElement("template");
modalTemplate.innerHTML = `
    <style>
        :host {
            display: block;
        }
        /* The Modal (backdrop) */
        .modal {
           /*  display: none;  */
            position: fixed; 
            z-index: 1; 
            padding-top: 100px; 
            left: 0;
            top: 0;
            width: 100%; 
            height: 100%; 
            overflow: auto; 
            background-color: rgba(0,0,0,0.4); 
        }
        /* Modal Content */
        .modal-content {
            max-width:500px;
            position: relative;
            background-color: #fefefe;
            margin: auto;
            padding: 0;
            border: 1px solid #888;
            width: 80%;
            box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);
            -webkit-animation-name: animatetop;
            -webkit-animation-duration: 0.4s;
            animation-name: animatetop;
            animation-duration: 0.4s
        }

        /* The Close Button */
        .close {
            color: white;
            float: right;
            font-size: 40px;
            font-weight: bold;
        }
        .close:hover,
        .close:focus {
            color: #000;
            text-decoration: none;
            cursor: pointer;
        }
        .modal-header {
            padding: 2px 16px;
            background-color: #b3bec9;
            color: white;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .modal-body {
            padding: 2px 16px; 
            margin: 20px 2px;
        }

        radio-group {
            padding:0.5rem;
        }
        radio-button {
            cursor: pointer;
            position: relative;
            display: inline-block;
            font-size: 18px;
            left: 30px;
            margin-right: 32px;
        }
        
        radio-button:focus {
            outline: none;
        }
        
        radio-button::before {
            content: '';
            display: block;
            width: 10px;
            height: 10px;
            border: 1px solid black;
            position: absolute;
            left: -18px;
            top: 7px;
            border-radius: 50%;
        }
        
        radio-button:focus::before {
            box-shadow: 0 0 3px 3px #83BEFF;
        }
        
        radio-button[aria-checked="true"]::before {
            content: '';
            display: block;
            width: 10px;
            height: 10px;
            background: blue;
            position: absolute;
            left: -18px;
            top: 7px;
            border-radius: 50%;
        }

        .reset-container {
            padding: 2rem 1rem 1rem 1rem;
            text-align: center;
        }
        
        .reset-container button {
            box-shadow: inset 0px 1px 0px 0px #ffffff;
            background: linear-gradient(to bottom, #ffffff 5%, #f6f6f6 100%);
            background-color: #ffffff;
            border-radius: 6px;
            border: 1px solid #dcdcdc;
            display: inline-block;
            cursor: pointer;
            color: #666666;
            font-family: Arial;
            font-size: 15px;
            font-weight: bold;
            padding: 0.5rem 1rem;
            text-decoration: none;
            text-shadow: 0px 1px 0px #ffffff;
        }
        
        .reset-container button:hover {
            background: linear-gradient(to bottom, #f6f6f6 5%, #ffffff 100%);
            background-color: #f6f6f6;
        }
        
        .reset-container button:active {
            position: relative;
        }
        
        .radio-container {
            margin: 0px 1rem;
            padding: 8px;
            display: flex;
            flex-direction: column;
        }

        .username-input-container {
            padding: 2rem 1rem 1rem 1rem;
            
        }
        .username-input-container input {
            
            margin: 0px 1rem;
            padding: 4px;
        }
        .username-label {
            display:block;
            margin-bottom: 1rem;
        }

    </style>
    <div class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <slot name="header"><h4>Settings</h4></slot>
                    <span class="close">&times;</span>
                </div>
                <div class="modal-body">
                
                <div class="radio-container">
                    <span class="radio-group-label">Clock display</span>
                    <radio-group id="radio-clock-display">
                    <radio-button data-value="12h">12h</radio-button>
                    <radio-button selected data-value="24h">24h</radio-button>
                    </radio-group>
                </div>
        
                <div class="radio-container">
                    <span class="radio-group-label"
                    >Send messages on Ctrl/CMD+Enter</span
                    >
                    <radio-group id="radio-send-shortcut">
                        <radio-button data-value="true">On</radio-button>
                        <radio-button selected data-value="false">Off</radio-button>
                    </radio-group>
                </div>
        
                <div class="username-input-container">
                    <span class="username-label">Username change</span>
                    <input type="text" id="username-input">
                </div>

                <div class="reset-container">
                    <button id="button-reset">Reset to defaults</button>
                </div>

                <div class="reset-container">
                    <button id="button-demo">Demo messages</button>
                </div>
                </div>
            </div>
        </div>
`;

window.customElements.define(
  "settings-modal",
  class extends HTMLElement {
    static get observedAttributes() {
      return ["radio-send-shortcut", "radio-clock-display", "username"];
    }
    constructor(props) {
      super(props);

      this.attachShadow({ mode: "open" });
      const modalNode = modalTemplate.content.cloneNode(true);
      this.shadowRoot.appendChild(modalNode);

      this.usernameInput = this.shadowRoot.getElementById("username-input");
    }

    connectedCallback() {
      this._modal = this.shadowRoot.querySelector(".modal");
      this.shadowRoot
        .querySelector(".close")
        .addEventListener("click", this._hideModal.bind(this));

      this.shadowRoot
        .getElementById("button-reset")
        .addEventListener("click", this._resetClick.bind(this));
      this.shadowRoot
        .getElementById("button-demo")
        .addEventListener("click", this._demoClick.bind(this));

      this.usernameInput.addEventListener(
        "keydown",
        this._onUsernameChange.bind(this)
      );
    }

    disconnectedCallback() {
      this.shadowRoot
        .querySelector(".close")
        .removeEventListener("click", this._hideModal);

      this.shadowRoot
        .getElementById("button-reset")
        .removeEventListener("click", this._resetClick);

      this.shadowRoot
        .getElementById("button-demo")
        .removeEventListener("click", this._demoClick);
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (name.startsWith("radio")) {
        const radioGroup = this.shadowRoot.getElementById(name);
        radioGroup.setAttribute("selected-value", newValue);
      } else if (name === "username") {
        this.usernameInput.value = newValue;
      }
    }

    _resetClick() {
      window.EventBus.dispatchEvent("settings-reset");
    }

    _onUsernameChange(e) {
      if (e.keyCode === 13) {
        window.EventBus.dispatchEvent("username-update", {
          value: this.usernameInput.value,
        });
        this.usernameInput.blur();
      }
    }

    _demoClick() {
      this._hideModal();
      window.EventBus.dispatchEvent("demo-messages");
    }

    _showModal() {
      this._modal.style.display = "block";
    }
    _hideModal() {
      this._modal.style.display = "none";
    }
  }
);

window.customElements.define(
  "radio-button",
  class extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      this.setAttribute("role", "radio");
      this.setAttribute("tabindex", -1);
      this.setAttribute("aria-checked", false);
    }
  }
);

window.customElements.define(
  "radio-group",

  class extends HTMLElement {
    static get observedAttributes() {
      return ["selected-value"];
    }
    constructor() {
      super();
    }

    connectedCallback() {
      this.setAttribute("role", "radiogroup");
      this.radios = Array.from(this.querySelectorAll("radio-button"));

      if (this.hasAttribute("selected")) {
        let selected = this.getAttribute("selected");
        this._selected = selected;
        this.radios[selected].setAttribute("tabindex", 0);
        this.radios[selected].setAttribute("aria-checked", true);
      } else {
        this._selected = 0;
        this.radios[0].setAttribute("tabindex", 0);
      }
      this.addEventListener("click", this.handleClick.bind(this));
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (name === "selected-value") {
        this.selectedValue = newValue;
      }
    }

    handleClick(e) {
      const idx = this.radios.indexOf(e.target);
      if (idx === -1) {
        return;
      }
      this.selected = idx;
    }

    set selectedValue(value) {
      const idx = Array.prototype.findIndex.call(this.radios, function (radio) {
        return radio.getAttribute("data-value") === value;
      });
      this.selected = idx;
    }

    get selectedValue() {
      return this.selected;
    }

    set selected(idx) {
      if (isFinite(this.selected)) {
        // Set the old button to tabindex -1
        let previousSelected = this.radios[this.selected];

        previousSelected.tabIndex = -1;
        previousSelected.removeAttribute("aria-checked", false);
      }

      // Set the new button to tabindex 0 and focus it
      let newSelected = this.radios[idx];
      newSelected.tabIndex = 0;
      newSelected.focus();
      newSelected.setAttribute("aria-checked", true);

      window.EventBus.dispatchEvent("radio-group-change", {
        key: this.getAttribute("id"),
        value: newSelected.getAttribute("data-value"),
      });

      this.setAttribute("selected", idx);
      this._selected = idx;
    }

    get selected() {
      return this._selected;
    }
  }
);

