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
        <span id="playerNameError" class="error-message"></span>
        </div>
      `;

    this.playerNameInput = shadowRoot.querySelector("#playerName");
    this.playerNameError = shadowRoot.querySelector("#playerNameError");
    this.classList.add("component-style");

    //Event listener for input validation
    this.playerNameInput.addEventListener("input", (event) => {
      this.validateInput.bind(this);
      this.dispatchEvent(
        new CustomEvent("playernamechange", {
          bubbles: true,
          composed: true,
          detail: { playerName: this.playerNameInput.value },
        })
      );
    });
  }

  validateInput() {
    const playerName = this.playerNameInput.value.trim();
    const allowedChars = /^[A-Za-z0-9 ]+$/;
    if (
      playerName.length < 3 ||
      playerName.length > 15 ||
      !allowedChars.test(playerName)
    ) {
      this.playerNameInput.classList.add("errorInput");
      this.playerNameError.textContent =
        "Please enter a valid name (minimum 3 characters, maximum 15. Only letters, numbers, and spaces are allowed).";
    } else {
      this.playerNameInput.classList.remove("errorInput");
      this.playerNameError.textContent = "";
    }
  }

  // validateStartGame(event) {
  //   this.validateInput();
  //   if (this.playerNameInput.classList.contains("error")) {
  //     event.stopImmediatePropagation(); // Prevent other listeners from executing
  //     alert("The player name has not been filled in yet or is incorrect.");
  //   } else {
  //     // Continue with starting the game
  //     console.log("Game started with player name:", this.playerNameInput.value);
  //   }
  // }

  show() {
    this.classList.remove("hidden");
  }
  hide() {
    this.classList.add("hidden");
  }
}

customElements.define("player-name", PlayerName);
export { PlayerName };
