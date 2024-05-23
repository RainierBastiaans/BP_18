import { BaseStock } from "./base-stock.js";

class TraditionalStock extends BaseStock {
  constructor( parts, initialQuantity = 0) {
    super(); // Call base class constructor
    // Create the parts dictionary with keys as part names and values as objects with price and quantity
    this.parts = new Map(
      parts.reduce((acc, part) => {
        // Ensure each part is an object with a "name" property
        if (!part || !part.name) {
          console.warn("Warning: Ignoring invalid part in parts array:", part);
          return acc; // Skip invalid parts
        }

        // Create a new object with price and initial quantity (0)
        const partInfo = { price: part.price, quantity: 0 };
        acc.set(part.name, partInfo);
        return acc;
      }, new Map())
    ); // Initialize an empty Map
  }

  requestPart(part) {
    this.usePart(part);
  }

  newRound() {
    for (const [partName, partInfo] of this.parts.entries()) {
      this.addPartsToStock(partName, 5);
    }
  }
}

export { TraditionalStock };
