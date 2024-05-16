class GameHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
            <style>
                h1 {
                    color: #fff;
                    background-color: #333;
                    padding: 20px;
                    margin-top: 0px;
                    text-align: center;
                }
            </style>
            <h1>Welcome to the LEAN Game</h1>
        `;
  }
}

customElements.define("game-header", GameHeader);
