class StartButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    const shadowRoot = this.shadowRoot;

    const styles = `
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
        input[type="text"] {
          display: block;
          width: 100%;
          padding: 10px;
          font-size: 16px;
          margin-bottom: 10px;
          border: 1px solid #ccc;
          border-radius: 3px;
        }
      </style>
    `;

    shadowRoot.innerHTML = `${styles}
      <input type="text" id="playerName" placeholder="Enter your name" />
      <button id="startButton">Start Game</button>
    `;

    const startButton = shadowRoot.querySelector("#startButton");
    const playerNameInput = shadowRoot.querySelector("#playerName");

    startButton.addEventListener("click", () => {
      const playerName = playerNameInput.value.trim();

      if (playerName.length < 3) {
        alert("Please enter a valid name (minimum 3 characters).");
        return;
      }
      this.dispatchEvent(
        new CustomEvent("startgame", {
          bubbles: true,
          composed: true,
          detail: { playerName },
        })
      );
    });
  }
}

customElements.define("start-button", StartButton);
