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
      this.performActionAtWorkstation();
    }, this.timeInterval);
  }

  stopAddingParts() {
    clearInterval(this.timer);
    this.timer = null;
  }

  async performActionAtWorkstation() {
    const car = this.game.getCarFromWorkstation(this.workstationId);
    if (!car){
      this.game.moveWaitingCars()
      return; // Handle no car case
    } 

    const workstation = this.game.workstations.get(this.workstationId); // Use Map for efficient access by ID

    if (workstation.isComplete(car.parts)) {
      this.game.manualMove(car); // Move completed car
    } else {
      const action = await this.decideAction(car, workstation); // Delegate action decision
      switch (action) {
        case 'addPart':
          this.game.addPart(workstation.getIncompletePart(car.parts).name, this.workstationId);
          break;
        case 'performQualityControl':
          // Implement quality control logic here (e.g., random check with chance of rework)
          break;
        case 'noAction':
          // Handle scenarios where no action is needed at the moment
          break;
        default:
          console.error(`Unexpected action: ${action}`);
      }
    }
  }

  async decideAction(car, workstation) {
    const incompletePart = workstation.getIncompletePart(car.parts);
    if (incompletePart) {
      return 'addPart';
    } else {
      // Implement logic to decide between quality control and no action
      // This could involve probabilities, car age, or other factors
      const performQualityControl = Math.random() < qualityControlChance; // Example with chance
      return performQualityControl ? 'performQualityControl' : 'noAction';
    }
  }
}

export { Bot };
