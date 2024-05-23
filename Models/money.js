class Money {
  constructor(amount) {
    this.amount = amount || 0; // Default to 0 if no initial amount provided
  }

  add(amount) {
    this.amount += amount;
  }

  deduct(amount) {
    if (amount > this.amount) {
      throw new Error("Insufficient funds");
    }
    this.amount -= amount;
  }

  getAmount() {
    return this.amount;
  }
}

export { Money };