import { gameValues } from "../game-values.js";
import { LeanMethod } from "./lean-method.js";

class OrderlyWorkplace extends LeanMethod {
  constructor(id, name, description) {
    super(id, name, description);
  }

  getBotIntervalMin() {
    if (this.isEnabled) {
      return gameValues.botMoveIntervalOWMin;
    }
    return gameValues.botMoveIntervalNoOWMin;
  }

  getBotIntervalMax() {
    if (this.isEnabled) {
      return gameValues.botMoveIntervalOWMax;
    }
    return gameValues.botMoveIntervalNoOWMax;
  }
}

export default OrderlyWorkplace;
