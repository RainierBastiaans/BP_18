class StartView extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });
    console.log("shadowRoot", shadowRoot);
    //Initialize elements
    this.initializeElements();

    this.timerInterval = null;
  }

  initializeElements() {
    this.gameHeader = document.querySelector("game-header");
    console.log(this.gameHeader);
    this.gameDescription = document.querySelector("game-description");
    this.gameOptions = document.querySelector("game-options");
    console.log(this.gameOptions);
    this.startButton = document.querySelector("start-button");
    console.log(this.startButton);

    if (!this.startButton) {
      throw new Error("Start button not found");
    }
  }

  show() {
    this.gameHeader.classList.remove("hidden");
    this.gameDescription.classList.remove("hidden");
    this.gameOptions.classList.remove("hidden");
    this.startButton.classList.remove("hidden");
  }

  hide() {
    this.gameHeader.classList.add("hidden");
    this.gameDescription.classList.add("hidden");
    this.gameOptions.classList.add("hidden");
    this.startButton.classList.add("hidden");
  }

  //BIND ELEMENTS WITH EVENTLISTENERS TO CONTROLLERS
  bindStartButtonClick(callback) {
    console.log("bindStartButtonClick");
    this.startButton.addEventListener("click", (event) => {
      event.preventDefault();
      callback();
    });
  }

  bindGameOptionSelected(callback) {
    this.gameOptions.addEventListener("change", (event) => {
      callback(event);
    });
  }

  getSelectedOptions() {
    const options = [];
    this.gameOptions.querySelectorAll("input, select").forEach((element) => {
      options.push(element.value);
    });
    return options;
  }
}

customElements.define("start-view", StartView);
export default StartView;
