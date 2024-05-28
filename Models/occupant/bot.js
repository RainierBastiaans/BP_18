import { Occupant } from "./occupant.js";

class Bot extends Occupant {
  constructor(name, workstationId, game, timeInterval) {
    super(name, workstationId, game);
    this.timeInterval = timeInterval || 500; // Default interval (1 second)
    this.timer = null; // Timer for adding parts
  }

  startWorking() {
    // Add a part to the workstation every time interval (simulates bot behavior)
    this.timer = setInterval(() => {
      this.game.addPartOrMoveBot(this.workstationId);
    }, this.timeInterval);
  }

  stopAddingParts() {
    clearInterval(this.timer);
    this.timer = null;
  }
}

export { Bot };
