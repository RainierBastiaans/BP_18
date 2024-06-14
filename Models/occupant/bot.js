import { gameValues } from "../../game-values.js";
import { Occupant } from "./occupant.js";

class Bot extends Occupant {
  constructor(name, workstationId, game) {
    super(name, workstationId, game);
    this.timeIntervalMin = gameValues.botMoveIntervalNoOWMin;
    this.timeIntervalMax = gameValues.botMoveIntervalNoOWMax;
    this.timer = null; // Timer for adding parts
    this.timeoutId = null; // Store the timeout ID
  }

  startWorking() {
    const randomInterval =
      Math.floor(
        Math.random() * (this.timeIntervalMax - this.timeIntervalMin + 1)
      ) + this.timeIntervalMin;
    this.timeoutId = setTimeout(() => {
      this.performActionAtWorkstation();
      this.startWorking(); // Restart after action
    }, randomInterval);
  }

  stopWorking() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  refresh(leanMethodService) {
    this.timeIntervalMin = leanMethodService
      .getLeanMethod("orderly-workplace")
      .getBotIntervalMin();
    this.timeIntervalMax = leanMethodService
      .getLeanMethod("orderly-workplace")
      .getBotIntervalMax();
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
