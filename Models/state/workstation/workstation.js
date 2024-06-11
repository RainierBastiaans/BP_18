import { gameValues } from "../../../game-values.js";

class Workstation {
  constructor(id, partsList, leanMethodService) {
    this.id = id;
    this.partnames = partsList; // Create a list of part names
    this.leanMethodService = leanMethodService;
    this.maintenanceChance = leanMethodService
      .getLeanMethod("total-productive-maintenance")
      .getMaintenanceChance();
    this.maintenanceDuration = leanMethodService
      .getLeanMethod("total-productive-maintenance")
      .getMaintenanceDuration();
  }

  set maintenanceChance(value) {
    if (typeof value !== "number" || value < 0 || value > 1) {
      throw new Error(
        "Invalid maintenanceChance: must be a number between 0 and 1"
      );
    }
    this._maintenanceChance = value;
  }

  get maintenanceChance() {
    return this._maintenanceChance;
  }

  set maintenanceDuration(value) {
    if (typeof value !== "number" || value <= 0) {
      throw new Error(
        "Invalid maintenanceDuration: must be a non-negative number"
      );
    }
    this._maintenanceDuration = value;
  }

  get maintenanceDuration() {
    return this._maintenanceDuration;
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
