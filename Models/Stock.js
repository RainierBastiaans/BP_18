class Stock {
  constructor() {
    this.parts = { frame: 0, interior: 0, door: 0, window: 0, tire: 0}; // Hardcoded Dictionary to store parts and their counts
  }

  newRound() {
    for (const part in this.parts) {
      this.parts[part] += 5;
    }
  }

  usePart(part) {
    if (part in this.parts && this.parts[part] > 0) {
      this.parts[part] -= 1;
    } else {
      throw new Error(`'${part}' is not in stock`);
    }
  }

  detachPart(part) {
    this.parts[part] += 1;
  }
}

export { Stock };
