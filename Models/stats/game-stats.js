import { gameValues } from "../../game-values.js";
import { Subject } from "../../subject.js";
import { Money } from "../money.js";
import { RoundStats } from "./round-stats.js";

class GameStats extends Subject {
  constructor(game) {
    super();
    this.game = game;
    this.capital = new Money(this, gameValues.startCapital);
    this.totalTimeSpent = 0;
    this.partUsage = {}; // Object to track total parts used (partName: count)
    this.carCompletionTimes = []; // Array to store completion times of each car
    this.carsCompleted = 0;
    this.carsBroken = 0;
    this.carsInProgress = 0;
    this.totalIncome = 0;
    this.rounds = new Map();
    this.facilityCost = gameValues.facilityCost;
    this.staffCost = gameValues.staffCost;
    this.cars = new Map()
    this.averageCarCompletionTime = 0;
  }
  addObserver(observer) {
    this.observers.push(observer);
    this.notifyObservers(this)
  }

  updateStock(addedStock) {
    const stockPrice = addedStock.price;
    this.currentRound.updateStock(stockPrice)
    this.capital.deduct(stockPrice);
    this.notifyObservers(this);
  }
  startGame(){
    this.startTime = performance.now(); // Capture the start time
  }

  getElapsedTime() {
    if (!this.startTime) {
      return 0; // No start time means no elapsed time
    }
    const currentTime = performance.now();
    return Math.floor((currentTime - this.startTime) / 1000); // Time in seconds
  }
  endGame(){
    this.totalTimeGame = this.getElapsedTime()
  }

  endRound(){
    this.currentRound.endRound()
  }
  startRound(){
    this.currentRound.startRound(this.cars)
  }
  newRound() {
    this.rounds.set(
      this.rounds.size + 1,
      new RoundStats(this.rounds.size + 1, this.game)
    )
    this.currentRound = this.rounds.get(this.rounds.size)
    console.log("gamestats" + this.currentRound)
    this.deductRoundCosts();
    this.notifyObservers(this)
  }

  updateCapital(capital) {
    this.capital = capital;
    this.notifyObservers(this);
  }

  updateCars(car) {
    // console.log(car)
    if (car.isComplete()) {
      this.newCarCompleted(car);
    } else if (car.isBroken()) {
      this.newCarBroken(car);
    }
    else if (car.state.workstationId===1){
      this.newCarInProgress(car)
    }
  }

  newCarInProgress(car){
    this.carsInProgress ++;
    this.currentRound.newCarInProgress(car);
    this.cars.set(car.id, {start:(((this.rounds.size-1)*gameValues.roundDuration)+this.currentRound.getElapsedTime()),end: undefined});
    this.notifyObservers(this);
  }


  deductRoundCosts() {
    this.capital.deduct(this.facilityCost+this.staffCost);
  }
  calculateAverageCarCompletionTime(){
    let totalTime = 0;
    Array.from(this.cars.values()).forEach((times)=>{
      // console.log(times)
      if (times.end){
        totalTime+= (times.end-times.start)
      }
    })
    this.averageCarCompletionTime = totalTime/this.carsCompleted;
    // console.log(this.averageCarCompletionTime)
  }

  newCarCompleted(car) {
    this.carsCompleted++;
    this.totalIncome += car.fixedPrice;
    this.carsInProgress--;
    this.cars.get(car.id).end = (((this.rounds.size-1)*gameValues.roundDuration)+this.currentRound.getElapsedTime())
    this.currentRound.newCarCompleted(car)
    this.capital.add(car.fixedPrice);
    this.calculateAverageCarCompletionTime()
    this.notifyObservers(this);
  }
  newCarBroken(car) {
    this.carsBroken++;
    this.carsInProgress--;
    this.cars.delete(car.id)
    this.currentRound.newCarBroken()
    this.notifyObservers(this);
  }
}

export { GameStats };
