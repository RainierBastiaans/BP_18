class StartButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
            <style>
                button {
                    display: block;
                    padding: 10px 20px;
                    font-size: 20px;
                    margin: 30px auto;
                    background-color: #28a745;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                }
                button:hover {
                    background-color: #218838;
                }
            </style>
            <button id="startButton">Start Game</button>
        `;

    this.shadowRoot
      .querySelector("#startButton")
      .addEventListener("click", () => {
        this.dispatchEvent(
          new CustomEvent("startgame", { bubbles: true, composed: true })
        );
      });
  }
}

customElements.define("start-button", StartButton);
