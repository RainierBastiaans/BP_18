import { gameValues } from "../game-values.js";
import { Emitter } from "../emitter.js";

class Round {
  constructor(roundNumber) {
    this.roundNumber = roundNumber;
    this.timeLeft = gameValues.roundDuration; // Time in seconds
    this.timerInterval = null;
    this.isOver = false;
    this.emitter = new Emitter(); // Create an Emitter instance
    this.startTimer();
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      if (this.isOver){
        clearInterval(this.timerInterval);
      }
      else if (this.timeLeft <= 0) {
        this.endRound();
      }
    }, 1000);
  }

  getRemainingTime() {
    return this.timeLeft;
  }

  endRound() {
    clearInterval(this.timerInterval);
    this.isOver = true; //this is not necessary anymore
    this.emitter.emit("roundoverInModel"); // Emit the event
  }
}
export { Round };
