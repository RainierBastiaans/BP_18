class GameDescriptionContainer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="styles.css">
            <style>
                .game-title {
                    display: flex;
                    justify-content: center;
                }
            </style>
            <h2 class = "game-title">Configure your factory!</h2>
            <p class = "game-description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam et quam vel sapien facilisis convallis. Ut hendrerit venenatis nulla, non aliquet erat tempus vel. Vivamus dictum lacus vitae turpis scelerisque, non porttitor neque dictum. Aliquam erat volutpat. Sed nec arcu vel nisl feugiat dignissim. Suspendisse potenti. Donec venenatis ultrices dolor, in efficitur velit condimentum nec. Mauris volutpat ligula nec libero dignissim, eget tristique lorem efficitur. Nulla facilisi. Integer eu massa non nisi facilisis feugiat nec id erat.            
            </p>
        `;
    this.classList.add("component-style");
  }

  show() {
    this.classList.remove("hidden");
  }
  hide() {
    this.classList.add("hidden");
  }
}

customElements.define("game-description-container", GameDescriptionContainer);
export { GameDescriptionContainer };
