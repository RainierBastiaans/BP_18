import { BaseStock } from "./base-stock.js";

class JITStock extends BaseStock {
  constructor(parts) {
    super(); // Call base class constructor
    this.parts = parts;
  }

  requestPart(part) {
    // Simulate receiving the part just-in-time
    if (!this.hasEnoughParts(part)) {
      this.addPartsToStock(part, 1);
    }
    this.usePart(part);
    console.log(`Just-In-Time: Received part "${part}".`);
  }

  newRound() {
    return;
  }
}

export { JITStock };
