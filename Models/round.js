import { gameValues } from "../game-values.js";
import { Emitter } from "../emitter.js";

class Round{
  constructor() {
    this.timeLeft = gameValues.roundDuration; // Time in seconds
    this.timerInterval = null;
    this.isOver = false;
    this.emitter = new Emitter(); // Create an Emitter instance
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
    this.emitter.emit("roundoverInModel"); // Emit the event
  }
    
}
export { Round };
