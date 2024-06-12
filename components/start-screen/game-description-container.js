class GameDescriptionContainer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="styles.css">
      <div class="game-description-heading vertical-container">
        <div class="game-description-title-container horizontal-container">
          <div class="game-name">Lean Game</div>
          <h1 class="game-title">How to play</h1>
        </div>
        <p class="game-about">
          The goal of <i>LEAN&trade;</i> is to make as much profit as possible by assembling cars. 
          Applying LEAN methods can help you run your factory more efficiently.
          Such as is with everything in life, too much of the good can have a negative effect as well.
          <i>Be mindful about why you apply a LEAN method!</i> 
          Try to beat your friends' high scores!
        </p>
      </div>

      <div class="game-description-main"> 
          ${this.createDescriptionStep(1)}
          ${this.createDescriptionStep(2)}
          ${this.createDescriptionStep(3)}
          ${this.createDescriptionStep(4)}
      </div>
    `;
  }

  //STEP TITLES
  getStepTitle(stepNumber) {
    switch (stepNumber) {
      case 1:
        return "How does it work?";
      case 2:
        return "Buy Parts and select your Workstation!";
      case 3:
        return "In-Game Actions";
      case 4:
        return "Optimising your factory";
      default:
        return "Did you try to create a new step? You shouldn't do that.";
    }
  }

  //STEP DESCRIPTIONS
  getStepDescription(stepNumber) {
    switch (stepNumber) {
      case 1:
        return `
          There are 5 workstations and 5 rounds.
          Each workstation has its own parts to add to the car. 
          Once you add all parts in your workstation, 
          the car will go to the next workstation. 
          When the car has all the parts added, it will be completed and sold.
          Completing a car yields a profit, but a broken car will cost you money.
        `;
      case 2:
        return `
          To assemble cars you will need to buy parts for each workstation in the <i>LEAN Shop</i>!
          You can buy parts at the start of each round.
          Do <b>not</b> buy too much, as you will lose money if you don't use them all.
          Ohh, and don't forget to select a workstation you will be creating the hottest new cars on!
          The bots will be waiting for you at the other workstations on the assembly line.
        `;
      case 3:
        return `
          When you are in the game, you can add parts to the car by clicking the part. 
          Parts can break, which causes a broken car that cannot be sold. 
          Workstations can also have maintenance breaks, so adding parts won't be an option for some time.
          When you run out of parts, you will have to wait until the start of the next round.
          If you selected a workstation that is not the first, you will have to wait for the car to arrive at your workstation from the previous one.
          Give the bots a break, they are working hard!
        `;
      case 4:
        return `
          At the start of each round, 
          there will be the possibility to buy parts and/or to apply a LEAN method. 
          Buy enough parts because so you won't run out.
          But don't buy too much, as you will lose money if you don't use them all!
          Or apply JIT (Just-In-Time) to your assembly line to buy parts only when you need them.
          This does raise the price per part, but you won't lose money on unused parts.
          Every LEAN method has its own pros and cons.
        `;
      default:
        return "Oops! Something went wrong. Please try refreshing the page.";
    }
  }

  createDescriptionStep(stepNumber) {
    return `
      <section class="game-description-step vertical-container">
        <div class="game-description-step-heading horizontal-container">
          <div class="game-description-step-number">${stepNumber}</div>
          <h3 class="game-description-step-title">${this.getStepTitle(
            stepNumber
          )}</h3>
        </div>
        <p class="game-description-step-text">${this.getStepDescription(
          stepNumber
        )}</p>
      </section>
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
