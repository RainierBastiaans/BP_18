class StartButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    const shadowRoot = this.shadowRoot;

    shadowRoot.innerHTML = `
      <link rel="stylesheet" href="styles.css">
      <input type="text" id="playerName" value = "Simon" placeholder="Enter your name" />
      <button id="startButton">Start Game</button>
    `;

    const startButton = shadowRoot.querySelector("#startButton");
    const playerNameInput = shadowRoot.querySelector("#playerName");

    startButton.addEventListener("click", () => {
      const playerName = playerNameInput.value.trim();
      const allowedChars = /^[A-Za-z0-9 ]+$/;
      if (
        playerName.length < 3 ||
        playerName.length > 15 ||
        !allowedChars.test(playerName)
      ) {
        alert(
          "Please enter a valid name (minimum 3 characters, maximum 15, Only letters, numbers, and spaces are allowed)."
        );
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
  show() {
    this.classList.remove("hidden");
  }
  hide() {
    this.classList.add("hidden");
  }
}

customElements.define("start-button", StartButton);
export { StartButton };
