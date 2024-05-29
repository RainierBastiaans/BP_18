class GameHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="styles.css">
            <h1 class="game-header">Welcome to the LEAN Game</h1>
        `;
  }
}

customElements.define("game-header", GameHeader);
