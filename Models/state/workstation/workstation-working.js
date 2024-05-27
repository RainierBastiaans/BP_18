import { Workstation } from "./Workstation.js";
import { UnderMaintenanceWorkstation } from "./workstation-under-maintenance.js";

class WorkingWorkstation extends Workstation{
  constructor(id, partsList, tpm) {
    super(id, partsList, tpm)
  }

  addPartToCar(workstations) {
    // Check if adding the part should trigger a random chance of under maintenance
    if (Math.random() < this.maintenanceChance) { 
      // Update the workstation state to UnderMaintenanceWorkstation
      workstations.set(this.id, new UnderMaintenanceWorkstation(this.id, this.partnames, undefined, workstations));
    } else {
      return;
    }
  }
}

export { WorkingWorkstation };