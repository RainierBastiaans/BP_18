class BaseStock {
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
  }

  usePart(part) {
    if (this.hasEnoughParts(part)) {
      this.parts[part] -= 1;
    } else {
      throw new Error(`${part} not in stock`);
    }
  }

  hasEnoughParts(partName) {
    // Check if the part exists and has sufficient quantity
    return this.parts.hasOwnProperty(partName) && this.parts[partName] > 0;
  }

  addPartsToStock(part, count) {
    this.parts[part] += count;
  }

  // Placeholder method for requestPart, subclasses will implement their own behavior
  requestPart(part) {
    throw new Error("requestPart not implemented in BaseStock");
  }

  newRound() {
    throw new Error("newRound not implemented in BaseStock");
  }
}

export { BaseStock };
