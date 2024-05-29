import { gameValues } from "../game-values.js";

class Round {
  constructor() {
    this.timeLeft = gameValues.roundDuration; // Time in seconds
    this.timerInterval = null;
    this.isOver = false;
    this.startTimer();
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
