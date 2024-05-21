class GameStats {
    constructor(game, capital) {
      this.game = game;
      this.capital = capital;
      this.carsCompleted = 0;
      this.totalTimeSpent = 0;
      this.totalIncome = 0;
      this.partUsage = {}; // Object to track total parts used (partName: count)
      this.carCompletionTimes = []; // Array to store completion times of each car
    }
  
    updateOnCarCompletion(car) {
      this.carsCompleted++;
      this.totalIncome+=car.fixedPrice;
      //this.totalTimeSpent += car.completionTime; // Assuming car has a completionTime property
  
      // Update part usage
      for (const [partName, isAdded] of Object.entries(car.parts)) {
        if (isAdded) {
          this.partUsage[partName] = (this.partUsage[partName] || 0) + 1;
        }
      }
  
      // Update car completion times
      this.carCompletionTimes.push(car.completionTime);
    }
  
    calculateAverageCompletionTime() {
      if (this.carsCompleted === 0) {
        return 0; // No cars completed yet
      }
      return this.totalTimeSpent / this.carsCompleted;
    }
  
    calculatePartUsageBreakdown() {
      const totalPartsUsed = Object.values(this.partUsage).reduce((sum, count) => sum + count, 0);
      const breakdown = {};
      for (const [partName, count] of Object.entries(this.partUsage)) {
        breakdown[partName] = (count / totalPartsUsed) * 100; // Percentage
      }
      return breakdown;
    }
  
    getMostUsedPart() {
      if (Object.keys(this.partUsage).length === 0) {
        return null; // No parts used yet
      }
      const mostUsedPart = Object.entries(this.partUsage).reduce((prev, current) => {
        return current[1] > prev[1] ? current : prev;
      }, [null, 0]); // Initialize with null and 0
      return mostUsedPart[0]; // Return the part name
    }
  }
  
  export { GameStats };
  