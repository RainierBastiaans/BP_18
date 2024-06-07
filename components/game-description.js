class GameDescription extends HTMLElement {
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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam et quam vel sapien facilisis convallis. Ut hendrerit venenatis nulla, non aliquet erat tempus vel. Vivamus dictum lacus vitae turpis scelerisque, non porttitor neque dictum. Aliquam erat volutpat. Sed nec arcu vel nisl feugiat dignissim. Suspendisse potenti. Donec venenatis ultrices dolor, in efficitur velit condimentum nec. Mauris volutpat ligula nec libero dignissim, eget tristique lorem efficitur. Nulla facilisi. Integer eu massa non nisi facilisis feugiat nec id erat. Sed pulvinar, purus nec malesuada elementum, libero erat hendrerit nulla, a fermentum nulla orci sit amet nulla. Nam a nisl eget velit dictum fringilla. Ut non dolor non elit auctor lacinia. Fusce auctor nulla in lectus elementum gravida. Curabitur consequat quam sit amet ligula vehicula, et hendrerit sapien pharetra. Vestibulum maximus risus a nulla vehicula, et vehicula felis luctus. Praesent luctus enim a lorem dictum, ac aliquet justo lacinia. Donec at nunc et purus aliquet suscipit. Nam ultricies efficitur dictum. Morbi sed dui ut sem mollis viverra at sit amet justo.            
            </p>
        `;
  }
  show() {
    this.classList.remove("hidden");
  }
  hide() {
    this.classList.add("hidden");
  }
}

customElements.define("game-description", GameDescription);
export { GameDescription };
