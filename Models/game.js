import { Round } from "./round.js";
import { Bot } from "./occupant/bot.js";
import data from "../db/parts.json" with { type: "json" };
import { GameStats } from "./stats/game-stats.js";
import { TraditionalStock } from "./stock/traditional-stock.js";
import { CarAtWorkstation } from "./state/car/car-at-workstation.js";
import { WorkingWorkstation } from "./state/workstation/workstation-working.js";
import { Car } from "./state/car/car.js";
import { Emitter } from "../emitter.js";
import { gameValues } from "../game-values.js";
import { LeanMethodService } from "../lean-methods/lean-method-service.js";
import { Stock } from "./stock/stock.js";
class Game {
  constructor(db, leanMethodService) {
    this.db = db
    this.leanMethodService = leanMethodService;
    this.workstations = new Map();
    this.rounds = new Map();
    this.carId = 1;
    this.cars = new Map();
    this.parts = data.parts;
    this.leanMethods = new Map();
    this.emitter = new Emitter(); // Create an Emitter instance
    this.isOver = false;
  }

  createOrRefreshWorkstations() {
    //every new round workstations get refreshed
    for (let i = 0; i < this.parts.length / 4; i++) {
      const startIndex = i * 4; // Starting index for each workstation (multiples of 4)
      const partList = this.parts.slice(startIndex, startIndex + 4); // Slice the first 4 parts
      this.workstations.set(
        i + 1,
        new WorkingWorkstation(
          i + 1,
          partList.map((partData) => partData.name),
          this.leanMethodService
        )
      );
    }
  }
  newGame(selectedWorkstation, playerName) {
    this.playerName = playerName;
    this.selectedWorkstation = selectedWorkstation;
    this.stats = new GameStats(this);
    this.stock = new Stock( this.parts, this.stats, this.leanMethodService);
    this.bots = [];
    // Create bots only for workstations other than selectedWorkstation
    for (let i = 1; i <= 5; i++) {
      if (i !== parseInt(selectedWorkstation)) {
        this.bots.push(new Bot(`bot${i}`, i, this));
      }
    }
    
    this.emitter.on("gameOverInModel", () => {
      this.endGame()
    });
    this.newCar();
  }

  newRound(leanMethod) {
    const roundnumber = this.rounds.size + 1;
    const newRound = new Round(roundnumber);
    this.stats.newRound();
    this.rounds.set(roundnumber, newRound);
    this.currentRound = newRound;
    this.newLeanMethod(leanMethod);
    this.stock.refreshStock(this.leanMethodService)
    this.stock.newRound();
    this.bots.forEach((bot) => bot.startWorking());
    this.createOrRefreshWorkstations();
    this.currentRound.emitter.on("roundoverInModel", () => {
      this.endRound()
    });
  }

  newLeanMethod(method) {
    if(method){
      this.leanMethodService.enableLeanMethod(method)
    }
  }

  moveCar(carToAdd) {
    return carToAdd.move(this.cars, this.workstations);
  }

  endRound() {
    if (this.currentRound.roundNumber === gameValues.numberOfRounds){
      this.endGame();
    }
    this.bots.forEach((bot) => bot.stopAddingParts());
    console.log(this.cars)
  }

  newCar() {
    const newCar = new Car(this.cars.size, this.parts);
    newCar.addObserver(this.stats);
    this.cars.set(this.cars.size, newCar);
  }

  getCarFromWorkstation(workstationid) {
    // Find the car with matching state
    const matchingCar = Array.from(this.cars.values()).find(
      (car) =>
        car.state instanceof CarAtWorkstation && car.state.workstationId === workstationid
    );
    return matchingCar; // Might return undefined if no car is found
  }

  moveWaitingCars() {
    for (const car of this.cars.values()) {
      this.moveCar(car);
    }
    this.newCarAtWorkstation1();
  }

  newCarAtWorkstation1() {
    if (!this.getCarFromWorkstation(1)) {
      this.newCar();
    }
  }

  addPart(part, workstationId) {
    this.moveWaitingCars();
    const currentWorkstation = this.workstations.get(workstationId);
    const car = this.getCarFromWorkstation(workstationId);
    
    try {
      currentWorkstation.addPartToCar(this.workstations, this.leanMethodService);
      this.stock.requestPart(part);
      this.cars.get(car.id).addPart(part, this.leanMethodService);
    } catch (error) {
      console.error(error);
    }
  }

  
  manualMove(car){
    car.manualMove(this.cars,this.workstations)
  }
  
  endGame() {
    this.isOver = true;
    this.updateHighscores();    
  }


  async updateHighscores() {
    await this.db.addHighscore(this.playerName, this.stats.capital.amount);
  }  
  
  getAmountOfPart(part){
    return this.stock.getAmountOfPart(part);
  }
  getRemainingTime(){
    return this.currentRound.getRemainingTime()
  }
}

export { Game };
