import { gameValues } from "../../game-values.js";

class RoundStats {
  constructor(roundNumber, game) {
    this.game = game;
    this.capital = 0;
    this.roundNumber = roundNumber;
    this.carsCompleted = 0; // Number of cars completed
    this.carsBroken = 0;
    this.carsInProgress = 0;
    this.totalCompletionTime = 0; // Total time taken for completed cars
    this.partUsage = {}; // Object to track parts used in this round (partName: count)
    this.totalStockCost = 0;
    this.totalIncome = 0;
    this.cars = new Map();
    this.deductFacilityCost();
    this.deductStaffCost();
    this.averageCarCompletionTime = 0;
  }

  deductFacilityCost() {
    this.capital -= gameValues.facilityCost;
  }

  deductStaffCost() {
    this.capital -= gameValues.staffCost;
  }

  updateStock(stockPrice) {
    this.capital -= stockPrice;
  }
  startRound(cars) {
    this.configureCars(cars);
    this.startTime = performance.now(); // Capture the start time
  }

  configureCars(cars) {
    Array.from(cars.values()).forEach((car) => {
      if (!car.end) {
        this.cars.set(car.id, {
          start:
            (this.roundNumber - 1) * gameValues.roundDuration +
            this.getElapsedTime(),
          end: undefined,
        });
      }
    });
  }

  endRound() {
    this.totalTimeRound = this.getElapsedTime();
  }

  calculateAverageCarCompletionTime() {
    let totalTime = 0;
    Array.from(this.cars.values()).forEach((times) => {
      console.log(times);
      if (times.end) {
        totalTime += times.end - times.start;
      }
    });

    this.averageCarCompletionTime = totalTime / this.carsCompleted;
  }

  getElapsedTime() {
    if (!this.startTime) {
      return 0; // No start time means no elapsed time
    }
    const currentTime = performance.now();
    return Math.floor((currentTime - this.startTime) / 1000); // Time in seconds
  }

  newCarInProgress(car) {
    this.cars.set(car.id, {
      start:
        (this.roundNumber - 1) * gameValues.roundDuration +
        this.getElapsedTime(),
      end: undefined,
    });
    this.carsInProgress++;
  }

  newCarCompleted(car) {
    this.carsCompleted++;
    this.totalIncome += car.fixedPrice;
    this.carsInProgress--;
    this.capital += car.fixedPrice;
    this.calculateAverageCarCompletionTime();
  }
  newCarBroken() {
    this.carsBroken++;
    this.carsInProgress--;
  }

  getRoundStats() {
    console.log(
      "stats of round: " + this.roundNumber + ". written by RoundStats.js"
    );
    return {
      carsCompleted: this.carsCompleted,
      carsBroken: this.carsBroken,
      carsInProgress: this.carsInProgress,
      totalIncome: this.totalIncome,
      capital: this.capital,
      averageCarCompletionTime: this.averageCarCompletionTime,
    };
  }
}
export { RoundStats };
