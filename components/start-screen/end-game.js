class EndGame extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.shadowRoot.innerHTML = `
                <link rel="stylesheet" href="styles.css">
                <h1 class="game-title">End of the Game</h1>
                <h2 class="game-subtitle">look at your stats and final score below</h2>`;
    }
  
    show() {
      this.classList.remove("hidden");
    }
    hide() {
      this.classList.add("hidden");
    }
  }
  
  customElements.define("end-game-component", EndGame);
  export { EndGame };
  