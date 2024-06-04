import { Subject } from "../../subject.js";

class BaseStock extends Subject {
  constructor(gamestats) {
    super();
    this.addObserver(gamestats);
  }

  usePart(part) {
    if (this.hasEnoughParts(part)) {
      this.parts.get(part).quantity -= 1;
      this.deductPrice(part);
    } else {
      throw new Error(`${part} not in stock`);
    }
  }

  hasEnoughParts(part) {
    // Check if the part exists and has sufficient quantity
    return this.parts.get(part).quantity > 0;
  }

  // Placeholder method for requestPart, subclasses will implement their own behavior
  requestPart(part) {
    throw new Error("requestPart not implemented in BaseStock");
  }

  newRound() {
    throw new Error("newRound not implemented in BaseStock");
  }

  getAmountOfPart(part) {
    return this.parts.get(part).quantity;
  }
}

export { BaseStock };
