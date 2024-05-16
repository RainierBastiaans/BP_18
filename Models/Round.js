class Round {
  // voorlopig nog niet nodig/gebruikt
  constructor() {
    this.timeLeft = 30; // Time in seconds
    this.timerInterval = null;
  }

  connectedCallback() {
    this.startTimer();
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      this.timeLeft--;

      if (this.timeLeft <= 0) {
        this.endGame();
      }
    }, 1000);
  }

  endGame() {
    clearInterval(this.timerInterval);
    alert("Game Over!");
    this.over = true;
  }
}
export { Round };
