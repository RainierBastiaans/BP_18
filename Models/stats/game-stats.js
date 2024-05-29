import { Subject } from "../../subject.js";
import { Money } from "../money.js";
import { RoundStats } from "./round-stats.js";

class GameStats extends Subject {
  constructor(game) {
    super();
    this.game = game;
    this.capital = new Money(this, 500000);
    this.totalTimeSpent = 0;
    this.partUsage = {}; // Object to track total parts used (partName: count)
    this.carCompletionTimes = []; // Array to store completion times of each car
    this.carsCompleted = 0;
    this.carsBroken = 0;
    this.totalIncome = 0;
    this.rounds = new Map();
    this.facilityCost = 50000;
    this.staffCost = 10000;
  }

  updateStock(addedStock) {
    const stockPrice = addedStock.price * addedStock.amount; //the price of the stock times the amount of stocks added.
    this.capital.deduct(stockPrice);
    this.notifyObservers(this);
  }

  updateCapital(capital) {
    this.capital = capital;
    this.notifyObservers(this);
  }

  updateCars(car) {
    if (car.isComplete()) {
      this.newCarCompleted(car);
    } else if (car.isBroken()) {
      this.newCarBroken();
    }
  }
  newRound() {
    this.rounds.set(
      this.rounds.size + 1,
      new RoundStats(this.rounds.size + 1, this.game)
    );
    this.deductRoundCosts();
    this.notifyObservers(this)
  }

  deductRoundCosts() {
    this.capital.deduct(this.facilityCost+this.staffCost);
  }

  newCarCompleted(car) {
    this.carsCompleted++;
    this.totalIncome += car.fixedPrice;
    this.capital.add(car.fixedPrice);
    this.notifyObservers(this);
  }
  newCarBroken() {
    this.carsBroken++;
    this.notifyObservers(this);
  }
}

export { GameStats };
