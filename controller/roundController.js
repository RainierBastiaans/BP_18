class RoundController {
  constructor(leanGame) {
    this.leanGame = leanGame;
    // Add event listeners for round interactions
    this.leanGame.addEventListener(
      "roundover",
      this.handleRoundOver.bind(this)
    );
    this.leanGame.addEventListener("gameover", this.handleGameOver.bind(this));
    // Additional setup for round interactions...
  }

  handleRoundOver(event) {
    clearInterval(this.leanGame.intervalId);
    this.leanGame.gameFacade.endRound();

    if (this.leanGame.gameFacade.isGameOver()) {
      this.leanGame.endGame();
      return;
    }

    this.leanGame.dispatchEvent(
      new CustomEvent("newround", {
        detail: this.leanGame.options,
        bubbles: true,
        composed: true,
      })
    );
  }

  handleGameOver(event) {
    clearInterval(this.leanGame.intervalId);
    this.leanGame.gameFacade.endGame();

    const gameDetails = this.leanGame.gameFacade.getGameDetails();

    this.leanGame.dispatchEvent(
      new CustomEvent("gameover", {
        detail: gameDetails,
        bubbles: true,
        composed: true,
      })
    );
  }

  // Additional methods for handling round interactions...
}

export { RoundController };
