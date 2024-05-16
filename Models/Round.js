class Round {
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
      //this.timeLeftElement.textContent = this.timeLeft;

      if (this.timeLeft <= 0) {
        this.endGame();
      }
    }, 1000);
  }

  endGame() {
    clearInterval(this.timerInterval);
    alert("round Over!");
  }
}
export { Round };
