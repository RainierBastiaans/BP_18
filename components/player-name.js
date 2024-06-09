class PlayerName extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    const shadowRoot = this.shadowRoot;

    shadowRoot.innerHTML = `
        <link rel="stylesheet" href="styles.css">
        <div class="input-container">
        <!-- <a href="https://www.flaticon.com/free-icons/worker" title="worker icon" 
        alt="Worker icons created by Smashicons - Flaticon">-->
        <img src="./img/player.png" alt="player icon" class="player-icon">
        </a>
        <input type="text" id="playerName" value = "" 
        placeholder="Enter your player name" minLength="3" maxLength="15"/>
        </div>
      `;

    const playerNameInput = shadowRoot.querySelector("#playerName");
    this.classList.add("component-style");

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
