class BaseStock {
  constructor() {
  }

  usePart(part) {
    if (this.hasEnoughParts(part)) {
      this.parts.get(part).quantity -= 1;
    } else {
      throw new Error(`${part} not in stock`);
    }
  }

  hasEnoughParts(part) {
    // Check if the part exists and has sufficient quantity
    return this.parts.get(part).quantity > 0;
  }

  addPartsToStock(part, count) {
    this.parts.get(part).quantity += count;
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
