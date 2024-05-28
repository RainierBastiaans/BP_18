class Round {
  constructor(stats) {
    this.timeLeft = 20; // Time in seconds
    this.timerInterval = null;
    this.isOver = false;
    this.startTimer();
    this.stats = stats;
  }


  startTimer() {
    this.timerInterval = setInterval(() => {
      this.timeLeft--;

      if (this.timeLeft <= 0) {
        this.endRound();
      }
    }, 1000);
  }

  endRound() {
    clearInterval(this.timerInterval);
    this.isOver = true;
  }
}
export { Round };
