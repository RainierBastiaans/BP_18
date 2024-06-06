import { gameValues } from "../../game-values.js";
import { StockState } from "./stock-state.js";

class JITStock extends StockState{
  constructor(stats) {
    super(stats); // Call base class constructor
  }

  requestPart(parts, part) {
    // Simulate receiving the part just-in-time
    if (!this.hasEnoughParts(parts, part)) {
      parts = this.addPartsToStock(parts, part, 1);
    }
    parts = this.usePart(parts, part);
    return parts
  }

  newRound(parts) {
    return (parts);
  }
  
  deductPrice(part) {
    return;
  }

}

export { JITStock };
