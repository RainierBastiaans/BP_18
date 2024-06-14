class GameOver extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
              <link rel="stylesheet" href="styles.css">
              <h1 class="game-title">Game Over</h1>
          <h2 class="game-subtitle">Insufficient funds</h2>
          <h3> Try Again </h3>
          `;
  }

  show() {
    this.classList.remove("hidden");
  }
  hide() {
    this.classList.add("hidden");
  }
}

customElements.define("game-over-component", GameOver);
export { GameOver };
