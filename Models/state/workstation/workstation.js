import { gameValues } from "../../../game-values";

class Workstation {
  constructor(id, partsList, tpm, workstations) {
    this.id = id;
    this.partnames = partsList; // Create a list of part names
    this.occupant = null; // Reference to the current occupant (User or Bot)
    this.maintenanceChance = tpm ? gameValues.workstationBreakdownChanceTPM : gameValues.workstationBreakdownChanceNoTPM; // Ternary operator for conditional assignment
  }

  setMaintenanceChance(maintenanceChance) {
    this.maintenanceChance = maintenanceChance;
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
