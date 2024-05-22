import { JustInTime } from "../lean-methods/just-in-time.js";

class Stock {
  constructor(parts) {
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

    this.justInTime;
  }

  setJustInTime() {
    this.justInTime = new JustInTime(this);
  }

  methodEnabled(method) {
    this.methods.get(method).isEnabled();
  }

  usePart(part) {
    this.parts[part] -= 1;
  }

  addPartsToStock(part, count) {
    this.parts[part] += count;
  }

  hasEnoughParts(partName) {
    // Check if the part exists and has sufficient quantity
    return this.parts.hasOwnProperty(partName) && this.parts[partName] > 0;
  }

  newRound() {
    for (const part in this.parts) {
      this.addPartsToStock(part, 5); //add 5 parts each to stock
    }
  }
}

export { Stock };
