class StartButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.playerName = "";
    const shadowRoot = this.shadowRoot;

    //this.classList.add("start-button-container");

    shadowRoot.innerHTML = `
      <link rel="stylesheet" href="styles.css">
      <button id="startButton">Start Game!</button>
    `;

    const startButton = shadowRoot.querySelector("#startButton");

    document.addEventListener("playernamechange", (event) => {
      this.playerName = event.detail.playerName;
    });

    startButton.addEventListener("click", (event) => {
      console.log("Start button clicked");
      if (this.validateInput(event)) {
        const playerName = this.playerName;
        this.dispatchEvent(
          new CustomEvent("startgame", {
            bubbles: true,
            composed: true,
            detail: { playerName },
          })
        );
      }
    });
  }

  validateInput(event) {
    const playerName = this.playerName.trim();
    const allowedChars = /^[A-Za-z0-9 ]+$/;
    if (
      playerName.length < 3 ||
      playerName.length > 15 ||
      !allowedChars.test(playerName)
    ) {
      event.stopImmediatePropagation(); // Prevent other listeners from executing
      alert("The player name has not been filled in yet or is incorrect.");
      return false;
    } else {
      // Continue with starting the game
      return true;
    }
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
