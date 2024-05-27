import { Workstation } from "./Workstation.js";
import { WorkingWorkstation } from "./workstation-working.js";

class UnderMaintenanceWorkstation extends Workstation {
    constructor(id, partsList, workstations, maintenanceDuration = 3000) { // Default duration in milliseconds (10 seconds)
      super(id, partsList);
      console.log('under maint')
      this.maintenanceDuration = maintenanceDuration;
      this.startTime = null; // Store the time under maintenance started
      this.workstations = workstations;
  
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
      throw new Error("Cannot add part, workstation is under Maintenance for ${seconds}");
    }
  
    transitionToWorkingState() {
      clearTimeout(this.timeoutId); // Clear the timer if set
      this.startTime = null; // Reset start time
  
      this.workstations.set(this.id, new WorkingWorkstation(this.id, this.partnames))
    }
  }
  

export { UnderMaintenanceWorkstation };
