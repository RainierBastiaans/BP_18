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
    this.deductFacilityCost();
    this.deductStaffCost();
  }

  deductFacilityCost() {
    this.capital -= gameValues.facilityCost;
  }

  deductStaffCost() {
    this.capital -= gameValues.staffCost;
  }

  updateStock(stockPrice) {
    this.capital-= stockPrice;
  }


  newCarInProgress(car) {
    this.carsInProgress++;
  }

  newCarCompleted(car) {
    this.carsCompleted++;
    this.totalIncome += car.fixedPrice;
    this.carsInProgress--;
    this.capital += car.fixedPrice;
  }
  newCarBroken() {
    this.carsBroken++;
    this.carsInProgress--;
  }
}
export { RoundStats };
