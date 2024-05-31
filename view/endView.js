class EndView extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });

    //Get references DOM elements
    this.statsContainer = document.getElementById("stats-container");

    //Initialize elements
    this.initializeElements();

    //Moet in model?
    this.timeLeft = 180; // Time in seconds
    this.timerInterval = null;
  }

  initializeElements() {
    this.gameHeader = this.shadowRoot.querySelector("game-header");
    this.gameOptions = this.shadowRoot.querySelector("game-options");
    this.newRoundButton = this.shadowRoot.getElementById("new-round-button");
    this.showStats = this.shadowRoot.querySelector("show-stats");
  }

  show() {
    this.gameHeader.classList.remove("hidden");
    this.newRoundButton.classList.remove("hidden");
    this.statsContainer.classList.remove("hidden");
    this.gameOptions.classList.remove("hidden");
  }

  hide() {
    this.gameHeader.classList.add("hidden");
    this.newRoundButton.classList.add("hidden");
    this.statsContainer.classList.add("hidden");
    this.gameOptions.classList.add("hidden");
  }
}

customElements.define("end-view", EndView);
export default EndView;
