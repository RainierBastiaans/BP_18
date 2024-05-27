import { LeanMethod } from "./lean-method.js";

class JustInTime extends LeanMethod {
  constructor() {
    super(
      "Just-In-Time",
      "Orders parts only when needed, reducing inventory costs."
    );
    this.justInTimeEnabled = false;
  }

  isEnabled() {
    return this.justInTimeEnabled;
  }

  enableJustInTime() {
    this.justInTimeEnabled = true;
  }

  disableJustInTime() {
    this.justInTimeEnabled = false;
  }

  newRound() {
    if (!this.justInTimeEnabled) {
      for (const part in this.stock.parts) {
        this.stock.newRound();
      }
    }
  }
}

export { JustInTime };
