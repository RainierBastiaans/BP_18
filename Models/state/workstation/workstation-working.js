import { Workstation } from "./workstation.js";
import { UnderMaintenanceWorkstation } from "./workstation-under-maintenance.js";

class WorkingWorkstation extends Workstation {
  constructor(id, partsList, leanMethodService) {
    super(id, partsList, leanMethodService);
  }

  addPartToCar(workstations, leanMethodService) {
    // Check if adding the part should trigger a random chance of under maintenance
    if (Math.random() < this.maintenanceChance) {
      // Update the workstation state to UnderMaintenanceWorkstation
      workstations.set(
        this.id,
        new UnderMaintenanceWorkstation(
          this.id,
          this.partnames,
          leanMethodService,
          workstations
        )
      );
    } else {
      return;
    }
  }

  getRemainingTime() {
    return;
  }
}

export { WorkingWorkstation };
