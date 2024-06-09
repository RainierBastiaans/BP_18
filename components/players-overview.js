class PlayersOverview extends HTMLElement {
  constructor(players) {
    super();
    this.players = players || []; // Set default empty array if no players provided
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
    //this.render();
  }
}

customElements.define("players-overview", PlayersOverview);
export { PlayersOverview };
