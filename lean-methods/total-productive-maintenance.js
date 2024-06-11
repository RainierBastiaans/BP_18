import { LeanMethod } from "./lean-method.js";
import { gameValues } from "../game-values.js";

class TotalProductiveMaintenance extends LeanMethod {
  constructor(id, name, description) {
    super(id, name, description);
  }

  getMaintenanceChance() {
    if (this.isEnabled) {
      return gameValues.workstationBreakdownChanceTPM;
    }
    return gameValues.workstationBreakdownChanceNoTPM;
  }

  getMaintenanceDuration() {
    if (this.isEnabled) {
      return gameValues.workstationMaintenanceDurationTPM;
    }
    return gameValues.workstationMaintenanceDurationNoTPM;
  }
}

export default TotalProductiveMaintenance;
