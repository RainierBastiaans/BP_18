import { gameValues } from "../../game-values.js";
import { StockState } from "./stock-state.js";

class TraditionalStock extends StockState {
  constructor(gameStats) {
    super(gameStats); // Call base class constructor
  }

  requestPart(parts, part) {
    return this.usePart(parts, part);
  }

  deductPrice(part) {
    return;
  }

  newRound(parts) {
    for (const [partName, partInfo] of parts.entries()) {
      parts = this.addPartsToStock(parts, partName, gameValues.partsPerRound);
    }
    return parts;
  }
}

export { TraditionalStock };
