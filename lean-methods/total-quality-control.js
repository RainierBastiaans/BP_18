import { gameValues } from "../game-values.js";
import { LeanMethod } from "./lean-method.js";

class TotalQualityControl extends LeanMethod {
  constructor(id, name, description) {
    super(id, name, description);
  }


    getPartBreakageChance(){
      if (this.isEnabled){
        return gameValues.partBreakageChanceTQC;
      }
      return gameValues.partBreakageChanceNoTQC;
    }
  }

  export default TotalQualityControl;
