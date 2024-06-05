import { Subject } from "../../subject.js";
import { JITStock } from "./jit-stock.js";
import { TraditionalStock } from "./traditional-stock.js";

class Stock extends Subject {
  constructor(parts, gamestats, leanMethodService) {
    super();
    this.parts = new Map(
      parts.reduce((acc, part) => {
        // Ensure each part is an object with a "name" property
        if (!part || !part.name) {
          //console.warn("Warning: Ignoring invalid part in parts array:", part);
          return acc; // Skip invalid parts
        }

        // Create a new object with price and initial quantity (0)
        const partInfo = { price: part.price, quantity: 0 };
        acc.set(part.name, partInfo);
        return acc;
      }, new Map())
    );

    this.addObserver(gamestats);
  }

  // Setter for state with conditional update
  set state(newState) {
    if (this._state){
      if (!(newState instanceof this._state.constructor)) {
        // Only update if the new state type is different
        this._state = newState;
      }
    }
    else{
      this._state = newState;
    }   
  }

  get state() {
    return this._state;
  }


  hasEnoughParts(part) {
    return this.state.hasEnoughParts(this.parts, part)
  }
  
  refreshStock(leanMethodService, stats){
    this.state = leanMethodService.getLeanMethod("just-in-time").isEnabled ? new JITStock(stats): new TraditionalStock(stats);
  }

  // Placeholder method for requestPart, subclasses will implement their own behavior
  requestPart(part) {
    this.parts = this.state.requestPart(this.parts, part)
  }

  newRound() {
    this.parts = this.state.newRound(this.parts)
  }

  getAmountOfPart(part) {
    return this.parts.get(part).quantity;
  }
}

export { Stock };
