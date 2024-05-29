import { gameValues } from "../../game-values.js";
import { Occupant } from "./occupant.js";

class Bot extends Occupant {
  constructor(name, workstationId, game) {
    super(name, workstationId, game);
    this.timeInterval = gameValues.botMoveInterval; // Default interval (1 second)
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
