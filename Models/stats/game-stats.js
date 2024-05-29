import { Subject } from "../../subject.js";
import { Money } from "../money.js";
import { RoundStats } from "./round-stats.js";

class GameStats extends Subject {
  constructor(game) {
    super();
    this.game = game;
    this.capital = new Money(100000);
    this.totalTimeSpent = 0;
    this.partUsage = {}; // Object to track total parts used (partName: count)
    this.carCompletionTimes = []; // Array to store completion times of each car
    this.carsCompleted;
    this.rounds = new Map();
    this.facilityCost = 50000;
    this.staffCost = 10000;
  }

  updateCarStats(cars) {
    let carsCompleted = 0;
    let totalIncome = 0;
    for (const car of cars.values()) {
      if (car.isComplete()) {
        carsCompleted++;
        totalIncome += car.fixedPrice;
      }
    }
    if (carsCompleted != this.carsCompleted) {
      this.carsCompleted = carsCompleted;
      this.totalIncome = totalIncome;
      this.notifyObservers(this);
    }
  }

  update(addedStock){
    const stockPrice = addedStock.price*addedStock.amount; //the price of the stock times the amount of stocks added.
    this.capital.deduct(stockPrice);
    this.notifyObservers(this)
  }
  newRound(){
    this.rounds.set(this.rounds.size+1, new RoundStats(this.rounds.size+1, this.game))
    this.deductFacilityCost();
    this.deductStaffCost();
  }

  deductFacilityCost() {
    this.capital.deduct(this.facilityCost); 
  }

  deductStaffCost() {
      this.capital.deduct(this.staffCost);
  }
  
  
}

export { GameStats };
