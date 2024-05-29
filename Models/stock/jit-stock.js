import { BaseStock } from "./base-stock.js";

class JITStock extends BaseStock {
  constructor(stats, parts) {
    super(stats); // Call base class constructor
    this.parts = parts;
  }

  requestPart(part) {
    // Simulate receiving the part just-in-time
    if (!this.hasEnoughParts(part)) {
      this.addPartsToStock(part, 1);
    }
    this.usePart(part);
  }

  newRound() {
    return;
  }
  deductPrice(part){
    return
  }
}

export { JITStock };
