import { gameValues } from "../../../game-values.js";
import { CarBroken } from "./car-broken.js";
import { CarCheckup } from "./car-checkup.js";
import { CarInLine } from "./car-inline.js";
import { CarState } from "./car-state.js";
import { Car } from "./car.js";

class CarAtWorkstation extends CarState {
  constructor(workstationid) {
    super()
    this.workstationId = workstationid;
    this.partBreakageChance = gameValues.partBreakageChanceNoTQC;
  }

  addPart(parts, partToAdd, leanMethodService) {
    parts = this.breakPart(parts, partToAdd, leanMethodService);
    // Check if the part exists in the map (case-sensitive)
    // Update the partAdded property to true for the existing part
    const partInfo = parts.get(partToAdd);
    partInfo.partAdded = true;
    parts.set(partToAdd, partInfo);
    return parts;
  }

  inProgress(){
    return true;
  }

  //returns true if car is broken
  qualityControl(parts) {
    // Check if all parts marked as added (partAdded === true) are not broken (broken === false)
    const addedParts = Array.from(parts.values()).filter(
      (part) => part.partAdded === true
    );
    this.qualityControlValue = !addedParts.every((part) => part.broken === false);
    return this.qualityControlValue;
  }


  move(cars, workstations) {
    return this;
  }

  manualMove(parts, workstations) {
    if (workstations.get(this.workstationId).isComplete(parts)) {
      if (this.workstationId >= 5) {
        return new CarCheckup();
      } else {
        return new CarInLine(this.workstationId + 1)
      }
    }
    return;
  }

  remove() {
    //when quality control goes red there should be a possibility to remove the car
    return new CarBroken();
  }

  breakPart(parts, partToBreak, leanMethodService) {
    // Get the part information from the parts list
    const partInfo = parts.get(partToBreak);
    // Simulate a chance to break with a probability of x
    const isBroken = Math.random() < leanMethodService.getLeanMethod("total-quality-control").getPartBreakageChance();
    partInfo.broken = isBroken;
    parts.set(partInfo.name, partInfo)
    return parts;
  }

  isComplete() {
    return false;
  }
  isBroken() {
    return false;
  }

  // ... other methods inherited from Car
}

export { CarAtWorkstation };
