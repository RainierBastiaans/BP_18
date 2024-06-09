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
            <h2 class="game-title"> Welcome to the factory! Here you can configure your factory and fire up the assembly line.</h2>
            <div class="game-description">
            <p></p>
            <p> On the left you can register yourself as a loyal employee at LEAN Enterprise! </p>
            <p> On the right you can select a workstation where you will be working today!</p>
            <p> Do not forget to buy parts for your workstation! You can buy parts below for each workstation!</p>
            <p> You will also find your fixed costs and other colleagues present in the factory today, ready to help you assemble as many cars as you want!</p>
            </div>
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
