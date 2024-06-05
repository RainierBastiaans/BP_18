import { gameValues } from "../../game-values.js";
import { StockState } from "./stock-state.js";

class TraditionalStock extends StockState{
  constructor(gameStats) {
    super(gameStats); // Call base class constructor
    
  }

  requestPart(parts, part) {
    return this.usePart(parts, part);
  }


  

  addPartsToStock(parts, part, count) {
    parts.get(part).quantity += count;
    this.notifyObservers({price: parts.get(part).price, amount: count}, "stock")
    return parts
  }
  deductPrice(part){
    return
  }

  newRound(parts) {
    for (const [partName, partInfo] of parts.entries()) {
      parts = this.addPartsToStock(parts ,partName, gameValues.partsPerRound);
    }
    return parts;
  }
}

export { TraditionalStock };
