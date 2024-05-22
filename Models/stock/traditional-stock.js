import { BaseStock } from "./base-stock.js";

class TraditionalStock extends BaseStock {
  constructor(parts, initialQuantity = 0) {
    super(parts); // Call base class constructor
    for (const part of parts) {
      this.parts[part] = initialQuantity; // Set initial stock levels
    }
  }

  requestPart(part) {
    this.usePart(part);
  }

  newRound() {
    for (const part in this.parts) {
      this.addPartsToStock(part, 5); //add 5 parts each to stock
    }
  }
}

export { TraditionalStock };
