import { gameValues } from "../game-values.js";
import { LeanMethod } from "./lean-method.js";

class TotalQualityControl extends LeanMethod {
    constructor() {
      super("Quality Control", "Inspects parts before assembly to reduce defects.");
    }


    getPartBreakageChance(){
      if (this.isEnabled){
        return gameValues.partBreakageChanceTQC;
      }
      return gameValues.partBreakageChanceNoTQC;
    }
  }

  export default TotalQualityControl;
