class Stock {
  constructor() {
    this.parts = { Frame: 0, Door: 0 }; // Hardcoded Dictionary to store parts and their counts
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
      throw new Error(`Part '${part}' is not in stock`);
    }
  }

  detachPart(part) {
    this.parts[part] += 1;
  }
}

export { Stock };
