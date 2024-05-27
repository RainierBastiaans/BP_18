import { WorkingState } from "./state/workstation-states/working-state.js";
import { UnderMaintenanceState } from "./state/workstation-states/under-maintenance-state.js";
class Workstation {
  constructor(id, partsList) {
    this.id = id;
    this.partnames = partsList.map((partData) => partData.name); // Create a list of part names
    this.occupant = null; // Reference to the current occupant (User or Bot)
    this.state = new WorkingState(this); // Initial state
    this.maintenaceChance = 0.5;
  }

  underMaintenance(){
    this.state = new UnderMaintenanceState(this)
  }

  setMaintenanceChance(maintenaceChance){
    this.maintenaceChance = maintenaceChance;
  }


  isComplete(carParts) {
    return this.partnames.every(
      (part) => carParts.get(part).partAdded === true
    );
  }

  getIncompletePart(carParts) {
    console.log(this.state)
    // Find the first part in the car's "parts" list that:
    // - is NOT marked as added (part.partAdded !== true)
    // - is present in the carParts list (carParts.includes(part.name))
    return Array.from(carParts.values()).find((part) => {
      return part.partAdded !== true && this.partnames.includes(part.name); // Replace with your validation logic
    });
  }
}

export { Workstation };
