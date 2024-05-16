class Round {
  constructor() {
    this.timeLeft = 10; // Time in seconds
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
    location.reload();
  }
}
export { Round };
