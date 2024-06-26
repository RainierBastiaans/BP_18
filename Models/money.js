import { InsufficientFundsError } from "../error/insufficient-funds-error.js";
import { Subject } from "../subject.js";

class Money extends Subject {
  constructor(stats, amount) {
    super();
    this.amount = this.formatAmount(amount); // Format and store initial amount
    this.addObserver(stats);
  }

  add(amount) {
    const newAmount = this.formatAmount(this.amount + amount);
    this.amount = newAmount;
    this.notifyObservers(this, "capital");
  }

  deduct(amount) {
    if (amount > this.amount) {
      throw new InsufficientFundsError("Insufficient funds");
    }
    const newAmount = this.formatAmount(this.amount - amount);
    this.amount = newAmount;
    this.notifyObservers(this, "capital");
  }

  getAmount() {
    return this.amount;
  }

  formatAmount(amount) {
    return parseFloat(amount.toFixed(0)); // Format to 0 decimal places
  }
}

export { Money };
