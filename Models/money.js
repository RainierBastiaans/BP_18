class Money {
  constructor(amount = 0) {
    this.amount = this.formatAmount(amount); // Format and store initial amount
  }

  add(amount) {
    const newAmount = this.formatAmount(this.amount + amount);
    this.amount = newAmount;
  }

  deduct(amount) {
    if (amount > this.amount) {
      throw new Error("Insufficient funds");
    }
    const newAmount = this.formatAmount(this.amount - amount);
    this.amount = newAmount;
  }

  getAmount() {
    return this.amount;
  }

  formatAmount(amount) {
    return parseFloat(amount.toFixed(0)); // Format to 0 decimal places
  }
}

export { Money };
