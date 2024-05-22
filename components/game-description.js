class GameDescription extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
            <style>
                p {
                    font-size: 18px;
                    color: #555;
                    padding: 20px;
                }
            </style>
            <p>
                This is an exciting game where you can test your LEAN skills and challenge your friends.
            </p>
        `;
  }
}

customElements.define("game-description", GameDescription);
