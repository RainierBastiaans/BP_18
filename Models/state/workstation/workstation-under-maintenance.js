import { Workstation } from "./workstation.js";
import { WorkingWorkstation } from "./workstation-working.js";

class UnderMaintenanceWorkstation extends Workstation {
  constructor(id, partsList, tpm, workstations, maintenanceDuration = 3000) {
    // Default duration in milliseconds (3 seconds)
    super(id, partsList);
    this.maintenanceDuration = maintenanceDuration;
    this.startTime = Date.now(); // Set startTime immediately in constructor
    this.workstations = workstations;
    this.tpm = tpm;

    // Optionally, set up a timer to transition back to working state
    this.setupMaintenanceTimer();
  }

  setupMaintenanceTimer() {
    // Use setTimeout to schedule the transition after maintenanceDuration
    this.timeoutId = setTimeout(() => {
      this.transitionToWorkingState();
    }, this.maintenanceDuration);
  }

  addPartToCar() {
    throw new Error(
      `Cannot add part, workstation ${
        this.id
      } is under Maintenance for ${this.getRemainingTime()} seconds remaining.`
    );
  }

  getRemainingTime() {
    return Math.max(
      0,
      Math.ceil(
        (this.maintenanceDuration - (Date.now() - this.startTime)) / 1000
      )
    );
  }

  transitionToWorkingState() {
    clearTimeout(this.timeoutId); // Clear the timer if set
    this.startTime = null; // Reset start time

    this.workstations.set(
      this.id,
      new WorkingWorkstation(this.id, this.partnames, this.tpm)
    );
  }
}

export { UnderMaintenanceWorkstation };
