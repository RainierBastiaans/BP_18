import { LeanMethod } from "./lean-method.js";

class JustInTime extends LeanMethod {
  constructor(stock) {
    super(
      "Just-In-Time",
      "Orders parts only when needed, reducing inventory costs."
    );
    this.stock = stock;
    this.justInTimeEnabled = false;
  }

  isEnabled(){
    return this.justInTimeEnabled;
  }

  enableJustInTime() {
    this.justInTimeEnabled = true;
  }

  disableJustInTime() {
    this.justInTimeEnabled = false;
  }

  newRound(){
    if (!(this.justInTimeEnabled)){
      for (const part in this.stock.parts) {
        this.stock.newRound();
      }
    }
  }

  requestPart(partName) {
    if (this.justInTimeEnabled) {
      this.stock.addPartsToStock(partName, 1);
      this.stock.usePart(partName); // Simulate receiving the part when requested in Just-In-Time
      console.log(`Just-In-Time: Received part "${partName}".`);
    } else {
      if (!this.stock.hasEnoughParts(partName)) {
        throw new Error("Not Enough Parts in Stock");
      }
      this.stock.usePart(partName);
    }
    return true; // Indicate successful part request
  }

  
}

export { JustInTime };
