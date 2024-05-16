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
                    max-width: 600px;
                    margin: 0 auto;
                }
            </style>
            <p>
                This is an exciting game where you can test your skills and challenge your friends. Get ready for an adventure!
            </p>
        `;
  }
}

customElements.define("game-description", GameDescription);
