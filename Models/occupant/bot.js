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
    if (!car) {
      this.game.moveWaitingCars();
      return; // Handle no car case
    }

    const workstation = this.game.workstations.get(this.workstationId); // Use Map for efficient access by ID
    const action = await this.decideAction(car, workstation); // Delegate action decision
    switch (action) {
      case "addPart":
        this.game.addPart(
          workstation.getIncompletePart(car.parts).name,
          this.workstationId
        );
        break;
      case "performQualityControl":
        //console.log('qc')
        car.qualityControl(car.parts);
        break;
      case "removeCar":
        //console.log('rm')
        car.remove();
        break;
      case "move":
        this.game.manualMove(car); // Move completed car
        break;
      default:
        //console.error(`Unexpected action: ${action}`);
    }
  }

  async decideAction(car, workstation) {
    if (workstation.getIncompletePart(car.parts)) {
      return "addPart";
    } else if (
      this.game.leanMethods.get("total_quality_control") &&
      car.getQualityControlValue() === undefined
    ) {
      return "performQualityControl";
    } else if (
      this.game.leanMethods.get("total_quality_control") &&
      car.getQualityControlValue() === true
    ) {
      return "removeCar";
    } else {
      return "move";
    }
  }
}

export { Bot };
