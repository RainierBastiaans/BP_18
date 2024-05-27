import { WorkingState } from "./working-state.js";

class UnderMaintenanceState {
    constructor(workstation) {
        this.workstation = workstation;
    
        // Transition back to working state after maintenance duration
        setTimeout(() => {
          clearInterval(this.intervalId); // Stop logging
          this.workstation.state =new WorkingState(workstation);
        }, 5000);
      }
}

export {UnderMaintenanceState}