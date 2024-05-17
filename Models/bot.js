import { Occupant } from "./occupant.js";

class Bot extends Occupant {
  constructor(name, workstationId, game, timeInterval) {
    super(name, workstationId, game);
    this.timeInterval = timeInterval || 1000; // Default interval (1 second)
    this.timer = null; // Timer for adding parts
  }

  startWorking() {
    // Add a part to the workstation every time interval (simulates bot behavior)
    this.timer = setInterval(() => {
      console.log("add part");
      this.game.addPartOrMoveBot(this.workstationId)
    }, this.timeInterval);
  }

  stopAddingParts() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}

export { Bot };
