import { Subject } from "../../subject.js";

class StockState extends Subject {
  constructor(gamestats) {
    super();
    this.addObserver(gamestats);
  }

  hasEnoughParts(parts, part) {
    // Check if the part exists and has sufficient quantity
    return parts.get(part).quantity > 0;
  }

  usePart(parts, part) {
    if (this.hasEnoughParts(parts, part)) {
      parts.get(part).quantity -= 1;
      this.deductPrice(part);
    } else {
      throw new Error(`${part} not in stock`);
    }
    return parts;
  }
  addPartsToStock(parts, part, count) {
    parts.get(part).quantity += count;
    this.notifyObservers(
      { price: parts.get(part).price*count},
      "stock"
    ); //probably need to adapt the pricing for JIT
    return parts;
  }
}

export { StockState };
