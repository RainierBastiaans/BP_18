import { LeanMethod } from "./lean-method.js";

class TotalProductiveMaintenance extends LeanMethod {
  constructor(workstations) {
    super("Total Productive Maintenance", "Focuses on preventing equipment breakdowns to maximize production efficiency.");
    this.workstations = workstations; // Store workstations for later use
    this.maintenanceChance = 0.001;
  }

  applyMethod() {
    // Iterate through the workstations and apply TPM logic
    for (const workstation of this.workstations) {
      // Implement TPM logic for each workstation
      workstation.maintenanceChance = 0.001; // Assuming 'maintenanceChance' exists in Workstation (replace with your TPM logic)
      console.log(`TPM applied to workstation ${workstation.id}`); // Optional logging
    }
  }
}

export { TotalProductiveMaintenance };
