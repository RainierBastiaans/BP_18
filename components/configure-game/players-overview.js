class PlayersOverview extends HTMLElement {
  constructor(players) {
    super();
    this.players = players || []; // Set default empty array if no players provided
    this.workstationOfPlayer = 1;

    this.attachShadow({ mode: "open" });
    const shadowRoot = this.shadowRoot;
    shadowRoot.innerHTML = `
        <link rel="stylesheet" href="styles.css">
        <div class="players-overview-container">
            <h2>Other players</h2>
            <div class="players-overview-list-container">
            </div>
        </div>
        `;
    this.classList.add("component-style");
    this.playersOverviewElement = shadowRoot.querySelector(
      ".players-overview-container"
    );
    this.render();
    document.addEventListener("workstationchange", (event) => {
      const selectedWorkstation = parseInt(event.detail.workstation);
      this.workstationOfPlayer = selectedWorkstation;
      this.render(); // Update UI with new workstations for bots
    });
  }

  update(players) {
    this.players = players;
    console.log("Players updated: ", this.players);
    this.render(); // Update UI with new players
  }

  render() {
    let listContainer = this.shadowRoot.querySelector(
      ".players-overview-list-container"
    );
    listContainer.innerHTML = ""; // Clear the container

    // Get the players with their workstations
    const players = this.players;
    const otherPlayersList = document.createElement("ul");
    otherPlayersList.classList.add("players-overview-list");

    listContainer.appendChild(otherPlayersList);
    players.forEach((player) => {
      // Create a list element for each player
      const otherPlayerElement = document.createElement("li");
      otherPlayerElement.classList.add("other-player-container");

      //Add a reference to the source of the player icon
      const playerSourceContainer = document.createElement("div");
      playerSourceContainer.classList.add("hidden");
      otherPlayerElement.appendChild(playerSourceContainer);
      const playerSourceReference = document.createElement("a");
      playerSourceReference.href = "https://www.flaticon.com/free-icons/robot";
      playerSourceReference.title = "robot icons";
      playerSourceReference.alt = "Robot icons created by Freepik - Flaticon";
      playerSourceContainer.appendChild(playerSourceReference);

      // Create an image element for the player icon
      const playerIcon = document.createElement("img");
      playerIcon.src = "./img/otherPlayer.png";
      playerIcon.alt = `Player ${player.name} icon`;
      playerIcon.classList.add("player-icon");
      otherPlayerElement.appendChild(playerIcon);

      // Create a div element for the player information
      const otherPlayerInfo = document.createElement("div");
      otherPlayerInfo.classList.add("other-player-info");
      //otherPlayerInfo.classList.add("vertical-container");
      otherPlayerElement.appendChild(otherPlayerInfo);

      // Create a span element for the player name
      const otherPlayerName = document.createElement("span");
      otherPlayerName.classList.add("other-player-name");
      otherPlayerName.textContent = player.name;
      otherPlayerInfo.appendChild(otherPlayerName);

      // Create a span element for the player workstation
      const otherPlayerWorkstation = document.createElement("span");
      otherPlayerWorkstation.classList.add("other-player-workstation");
      otherPlayerWorkstation.textContent =
        "Stationed on workstation " + player.workstation;
      otherPlayerInfo.appendChild(otherPlayerWorkstation);

      otherPlayersList.appendChild(otherPlayerElement);
    });
  }

  show() {
    this.classList.remove("hidden");
  }
  hide() {
    this.classList.add("hidden");
  }
}

customElements.define("players-overview", PlayersOverview);
export { PlayersOverview };
