import { Part } from "./part.js";
import { Car } from "./car.js";
class Workstation {
  constructor(id, partsList) {
    this.id = id;
    this.partnames = partsList.map((partData) => partData.name); // Create a list of part names
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
    return this.partnames.every(
      (part) => carParts.get(part).partAdded === true
    );
  }

  getIncompletePart(carParts) {
    // Find the first part in the car's "parts" list that:
    // - is NOT marked as added (part.partAdded !== true)
    // - is present in the carParts list (carParts.includes(part.name))
    return Array.from(carParts.values()).find((part) => {
      return part.partAdded !== true && this.partnames.includes(part.name); // Replace with your validation logic
    });
  }
}

export { Workstation };
