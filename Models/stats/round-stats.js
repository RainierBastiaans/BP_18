class RoundStats {
  constructor(roundNumber, game) {
    this.game = game;
    this.capital = 0;
    this.roundNumber = roundNumber;
    this.carsCompleted = 0; // Number of cars completed
    this.totalCompletionTime = 0; // Total time taken for completed cars
    this.partUsage = {}; // Object to track parts used in this round (partName: count)
    this.totalStockCost = 0;
    this.totalIncome = 0;
    this.deductStaffCost(3000);
    this.deductStockMaintenanceCost(1000);
    this.deductFacilityCost(50000);
  }

  getRoundCapital() {
    return this.capital;
  }

  updateOnCarCompletion(car) {
    this.carsCompleted++;
    this.totalIncome += car.fixedPrice;
    this.capital.add(car.fixedPrice);
    this.totalCompletionTime += car.completionTime; // Assuming car has a completionTime property

    // Update part usage for this round
    for (const [partName, isAdded] of Object.entries(car.parts)) {
      if (isAdded) {
        this.partUsage[partName] = (this.partUsage[partName] || 0) + 1;
      }
    }
  }
  deductFacilityCost(facilityCost) {
    this.capital -= facilityCost;
  }

  deductStockMaintenanceCost(costPerPart) {
    const totalStockCost = Object.values(this.game.stock.parts).reduce(
      (sum, count) => sum * costPerPart,
      0
    );
    this.totalStockCost += totalStockCost;
    this.capital -= totalStockCost;
  }

  deductStaffCost(staffCost) {
    this.capital -= staffCost;
  }

  getAverageCompletionTime() {
    if (this.carsCompleted === 0) {
      return 0; // No cars completed this round
    }
    return this.totalCompletionTime / this.carsCompleted;
  }

  getMostUsedPart() {
    if (Object.keys(this.partUsage).length === 0) {
      return null; // No parts used this round
    }
    const mostUsedPart = Object.entries(this.partUsage).reduce(
      (prev, current) => {
        return current[1] > prev[1] ? current : prev;
      },
      [null, 0]
    ); // Initialize with null and 0
    return mostUsedPart[0]; // Return the part name
  }
}
export { RoundStats };
