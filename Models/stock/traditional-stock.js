import { BaseStock } from "./base-stock.js";

class TraditionalStock extends BaseStock {
  constructor(parts, initialQuantity = 0) {
    super(); // Call base class constructor
    // Create the parts dictionary from the provided parts
    this.parts = parts.reduce((acc, part) => {
        // Ensure each part is an object with a "name" property
        if (!part || !part.name) {
          console.warn("Warning: Ignoring invalid part in parts array:", part);
          return acc; // Skip invalid parts
        }
        acc[part.name] = 0; // Initialize quantity to 0
        return acc;
      }, {});
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
