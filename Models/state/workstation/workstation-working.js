import { Workstation } from "./Workstation.js";
import { UnderMaintenanceWorkstation } from "./workstation-under-maintenance.js";

class WorkingWorkstation extends Workstation{
  constructor(id, partsList) {
    super(id, partsList)
  }

  addPartToCar(workstations) {
    // Check if adding the part should trigger a random chance of under maintenance
    if (Math.random() < this.maintenaceChance) { // Compare with 0.01 for 1% chance
      // Update the workstation state to UnderMaintenanceWorkstation
      workstations.set(this.id, new UnderMaintenanceWorkstation(this.id, this.partnames, workstations));
    } else {
      return;
    }
  }
}

export { WorkingWorkstation };
