class StartView extends HTMLElement {
  constructor() {
    super();
    console.log("view");
    const shadowRoot = this.attachShadow({ mode: "open" });
    
    // Create references to existing web components (assuming they're defined elsewhere)
    const gameHeaderComponent = document.createElement("game-header");
    const gameDescriptionComponent = document.createElement("game-description");
    const gameOptionsComponent = document.createElement("game-options");
    const startButtonComponent = document.createElement("start-button");
    // Append elements to the shadow root
    shadowRoot.append(
      gameHeaderComponent,
      gameDescriptionComponent,
      gameOptionsComponent,
      startButtonComponent
    );
  }
  connectedCallback() {
    this.gameHeaderComponent = this.shadowRoot.querySelector("game-header");
    this.gameDescriptionComponent = this.shadowRoot.querySelector("game-description");
    this.gameOptionsComponent = this.shadowRoot.querySelector("game-options");
    this.startButtonComponent = this.shadowRoot.querySelector("start-button");
  }


  show() {
    this.classList.remove("hidden")
  }

  hide() {
    this.classList.add("hidden")
  }

  //BIND ELEMENTS WITH EVENTLISTENERS TO CONTROLLERS
  bindStartButtonClick(callback) {
    console.log(this.startButtonComponent.shadowRoot.querySelector("#startButton"));
    document.querySelector("start-button").addEventListener("click", () => {
      console.log("click");
      // callback();
    });

  }

  bindGameOptionSelected(callback) {
    this.gameOptions.addEventListener("change", (event) => {
      callback(event);
    });
  }

  getSelectedOptions() {
    return
    const options = [];
    this.gameOptions.querySelectorAll("input, select").forEach((element) => {
      options.push(element.value);
    });
    return options;
  }
}

customElements.define("start-view", StartView);
export default StartView;
