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
  }

  newRound() {
    for (const part in this.parts) {
      this.parts[part] += 5;
    }
  }

  usePart(part) {
    this.parts[part] -= 1;
  }

  detachPart(part) {
    this.parts[part] += 1;
  }
  
  hasEnoughParts(partName) {
    // Check if the part exists and has sufficient quantity
    return this.parts.hasOwnProperty(partName) && this.parts[partName] > 0;
  }
}

export { Stock };
