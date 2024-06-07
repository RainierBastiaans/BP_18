class PlayerName extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    const shadowRoot = this.shadowRoot;

    shadowRoot.innerHTML = `
        <link rel="stylesheet" href="styles.css">
        <div class="input-container">
        <img src="./img/player.png" alt="Player" class="player-icon">
        <input type="text" id="playerName" value = "Player 1" 
        placeholder="Enter your name" minLength="3" maxLength="15"/>
        </div>
      `;

    const playerNameInput = shadowRoot.querySelector("#playerName");

    playerNameInput.addEventListener("change", () => {
      const playerName = playerNameInput.value.trim();
      const allowedChars = /^[A-Za-z0-9 ]+$/;
      if (
        playerName.length < 3 ||
        playerName.length > 15 ||
        !allowedChars.test(playerName)
      ) {
        alert(
          "Please enter a valid name (minimum 3 characters, maximum 15. Only letters, numbers, and spaces are allowed)."
        );
        return;
      }
    });

    this.playerName = playerNameInput.value;
  }
  show() {
    this.classList.remove("hidden");
  }
  hide() {
    this.classList.add("hidden");
  }
}

customElements.define("player-name", PlayerName);
export { PlayerName };
