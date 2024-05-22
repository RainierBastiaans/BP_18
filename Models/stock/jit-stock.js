import { BaseStock } from "./base-stock.js";

class JITStock extends BaseStock {
    constructor(parts) {
      super(parts); // Call base class constructor
    }
  
    requestPart(part) {
      // Simulate receiving the part just-in-time
      this.addPartsToStock(part, 1);
      this.usePart(part)
      console.log(`Just-In-Time: Received part "${part}".`);
    }

    newRound(){
        return;
    }
  }

  export {JITStock}
  