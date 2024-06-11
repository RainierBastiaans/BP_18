class GameDescriptionContainer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="styles.css">
            <h1 class="game-title">Lean Game</h1>
        <h2 class="game-subtitle">Welcome to the factory! Here you can configure your factory and fire up the assembly line.</h2>
        <div class="game-description">
            <h3>About the Game</h3>
            <p>Lean Game is a game where the goal is to make as much money as possible by assembling cars. The aim is to use lean methods to see how effective they really are. Try to beat your friends' high scores!</p>
            
            <h3>How It Works</h3>
            <p>There are 5 workstations. You will be able to choose the one you like to operate. Each workstation has its own parts to add to the car. Once you add all parts in your workstation, the car will go to the next workstation. When the car has all the parts added, it will be completed and sold.</p>
            
            <h3>In-Game Actions</h3>
            <p>When you are in the game, you can add parts to the car by clicking the part. Parts can break, which causes a broken car that cannot be sold. Workstations can also have maintenance breaks, so adding parts won't be an option for some time.</p>
            
            <h3>Buying Parts</h3>
            <p>At the start of each round, there will be the possibility to buy parts. Buy enough parts because whenever you run out, you will have to wait until the start of the next round.</p>
        </div>
        `;
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
