import { gameValues } from "../../game-values.js";
import { BaseStock } from "./base-stock.js";

class JITStock extends BaseStock {
  constructor(stats, parts) {
    super(stats); // Call base class constructor
    this.parts = parts;
    this.jitprice = gameValues.jitExtraPrice; //with Jit, parts are more expensive
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
  deductPrice(part) {
    return;
  }
  addPartsToStock(part, count) {
    this.parts.get(part).quantity += count;
    this.notifyObservers({price: this.parts.get(part).price * this.jitprice, amount: count}, "stock")
  }
}

export { JITStock };
