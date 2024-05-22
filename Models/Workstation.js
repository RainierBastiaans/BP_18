import { Part } from "./Part.js";
import { Car } from "./Car.js";
class Workstation {
  constructor(id, partsList) {
    this.id = id;
    this.parts = partsList.map(
      (partData) => new Part(partData.name, partData.price)
    ); // Create Part objects from data
    this.occupant = null; // Reference to the current occupant (User or Bot)
  }

  setOccupant(occupant) {
    this.occupant = occupant;
  }

  workOnStation() {
    if (this.occupant) {
      this.occupant.isWorking(this); // Call occupant's work method with the workstation
    }
  }

  isComplete(carParts) {
    // Check if all parts in the workstation are marked as true in the car
    return this.parts.every((part) => carParts[part.name] === true);
  }

  getIncompletePart(carParts) {
    return this.parts.find((part) => carParts[part.name] === false);
  }
}

export { Workstation };
