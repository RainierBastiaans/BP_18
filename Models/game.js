import { Round } from "./round.js";
import { Bot } from "./occupant/bot.js";
import { GameStats } from "./stats/game-stats.js";
import { TraditionalStock } from "./stock/traditional-stock.js";
import { CarAtWorkstation } from "./state/car/car-at-workstation.js";
import { WorkingWorkstation } from "./state/workstation/workstation-working.js";
import { Car } from "./state/car/car.js";
import { Emitter } from "../emitter.js";
import { gameValues } from "../game-values.js";
import { LeanMethodService } from "../lean-methods/lean-method-service.js";
import { Stock } from "./stock/stock.js";
import { HighscoresDB } from "../db/highscores.js";
import { InsufficientFundsError } from "../error/insufficient-funds-error.js";
class Game {
  constructor(db, leanMethodService, parts) {
    this.db = db;
    this.leanMethodService = leanMethodService;
    this.workstations = new Map();
    this.rounds = new Map();
    this.carId = 1;
    this.startTime = null; // Variable to store the start time
    this.cars = new Map();
    this.parts = parts;
    this.leanMethods = new Map();
    this.emitter = new Emitter(); // Create an Emitter instance
    this.isOver = false;
    this.stats = new GameStats(this);
    this.stock = new Stock(this.parts, this.stats, this.leanMethodService);
    this.stats.newRound(); //stats already start at the beginning
  }

  partExists(partName) {
    try{
      const matchingPart = this.parts.find((part) => part.id === partName);
      if (!matchingPart) {
        throw new Error(
          `Part not found: '${partName}' does not exist in available parts`
        );
      }
      return true;
    }
    catch (error){
      window.reportError(error)
    }
    
  }

  set db(db) {
    try{
      if (!(db instanceof HighscoresDB)) {
        throw new Error("Invalid db: must be of type HighscoreDB");
      }
      this._db = db; // Use a private property to prevent further modification
    }
    catch(error){
      window.reportError(error)
    }
  }

  set leanMethodService(leanMethodService) {
    try{
      if (!(leanMethodService instanceof LeanMethodService)) {
        throw new Error(
          "Invalid leanMethodService: must be of type LeanMethodService"
        );
      }
      this._leanMethodService = leanMethodService; // Use a private property
    }
    catch(error){
      window.reportError(error)
    }
  }

  get db() {
    return this._db; // Return the private property for db
  }

  get leanMethodService() {
    return this._leanMethodService; // Return the private property for leanMethodService
  }

  createOrRefreshWorkstations() {
    try{
      if (this.parts === undefined || this.parts.length === 0) {
        throw new Error(
          "Parts are not defined or empty. Cannot create workstations without parts."
        );
      }
  
      const partsByWorkstation = new Map();
      for (const part of this.parts) {
        if (part.workstationFK === undefined || part.workstationFK === null) {
          throw new Error("WorkstationFK is not defined for part: " + part.id);
        }
        if (!partsByWorkstation.has(part.workstationFK)) {
          partsByWorkstation.set(part.workstationFK, []);
        }
        partsByWorkstation.get(part.workstationFK).push(part);
      }
  
      for (let i = 1; i <= 5; i++) {
        const partsList = partsByWorkstation.get(i) || [];
        this.workstations.set(
          i,
          new WorkingWorkstation(
            i,
            partsList.map((partData) => partData.id),
            this.leanMethodService
          )
        );
      }
    }
    catch(error){
      window.reportError(error)
    }    
  }

  startGame(selectedWorkstation, playerName, bots) {
    this.playerName = playerName;
    this.selectedWorkstation = parseInt(selectedWorkstation);
    this.bots = [];
    for (let i = 0; i < bots.length; i++) {
      this.bots.push(new Bot(bots[i].name, bots[i].workstation, this));
    }
    this.emitter.on("gameOverInModel", () => {
      this.endGame();
    });
  }

  // Add a setter for selectedWorkstation
  set selectedWorkstation(value) {
    if (!Number.isInteger(value) || value < 1 || value > 5) {
      throw new Error(
        "Invalid selectedWorkstation: must be an integer between 1 and 5"
      );
    }
    this._selectedWorkstation = value;
  }

  // Add a getter for selectedWorkstation (optional)
  get selectedWorkstation() {
    return this._selectedWorkstation;
  }

  newRound(leanMethod) {
    const roundnumber = this.rounds.size + 1;
    const newRound = new Round(roundnumber);
    this.stats.startRound();
    this.rounds.set(roundnumber, newRound);
    this.currentRound = newRound;
    this.newLeanMethod(leanMethod);
    this.stock.refreshStock(this.leanMethodService, this.stats);
    this.bots.forEach((bot) => {
      bot.refresh(this.leanMethodService);
    });
    this.stock.refreshStock(this.leanMethodService, this.stats);
    this.bots.forEach((bot) => {
      bot.refresh(this.leanMethodService);
    });
    // this.stock.newRound();
    this.bots.forEach((bot) => bot.startWorking());
    this.createOrRefreshWorkstations();
    this.currentRound.emitter.on("roundoverInModel", () => {
      this.endRound();
    });
  }

  newLeanMethod(method) {
    if (method) {
      this.leanMethodService.enableLeanMethod(method);
    }
  }

  moveCar(carToAdd) {
    return carToAdd.move(this.cars, this.workstations);
  }

  endRound() {
    this.bots.forEach((bot) => bot.stopWorking());
    this.stock.endRound();
    this.stats.endRound();
    if (this.currentRound.roundNumber === gameValues.numberOfRounds) {
      this.endGame();
      return;
    }
    this.stats.newRound(); //stats already start at the beginning
  }

  newCar() {
    const newCar = new Car(this.cars.size, this.parts, this.stats);
    this.cars.set(this.cars.size, newCar);
  }

  getCarFromWorkstation(workstationId) {
    try{
      if (
        !Number.isInteger(workstationId) ||
        workstationId < 1 ||
        workstationId > 5
      ) {
        throw new Error(
          "Invalid workstationId: must be an integer between 1 and 5"
        );
      }
  
      // Find the car with matching state
      const matchingCar = Array.from(this.cars.values()).find(
        (car) =>
          car.state instanceof CarAtWorkstation &&
          car.state.workstationId === workstationId
      );
      return matchingCar; // Might return undefined if no car is found
    }
    catch(error){
      window.reportError(error)
    }
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
    if (this.partExists(part)) {
      this.moveWaitingCars();
      const currentWorkstation = this.workstations.get(workstationId);
      const car = this.getCarFromWorkstation(workstationId);

      try {
        currentWorkstation.addPartToCar(
          this.workstations,

          this.leanMethodService
        );
        this.stock.requestPart(part);
        this.cars.get(car.id).addPart(part, this.leanMethodService);
      } catch (error) {
        return; //part isn't in stock or workstation is under maintenance
      }
    }
  }

  manualMove(car) {
    try{
      if (!(car instanceof Car)) {
        throw new Error("Invalid car: must be of type Car");
      }
      car.manualMove(this.cars, this.workstations);
    }
    catch(error){
      window.reportError(error)
    }
  }

  endGame() {
    this.bots?.forEach((bot) => bot.stopWorking());
    this.isOver = true;
    if(this.currentRound){
      this.currentRound.isOver = true;
    } 
    if (this.rounds.size === gameValues.numberOfRounds){
      this.updateHighscores();
    }
  }

  async updateHighscores() {
    await this.db.addHighscore(this.playerName, this.stats.capital.amount);
  }

  getAmountOfPart(part) {
    return this.stock.getAmountOfPart(part);
  }

  getStockFromWorkstation(workstationIndex) {
    console.log(workstationIndex);
    return this.workstations.get(workstationIndex).getStock();
  }

  getRemainingTime() {
    return this.currentRound.getRemainingTime();
  }

  buyStock(parts) {
      this.stock.addPartsToStock(parts);     
    
  }

  getFixedCosts() {
    let fixedCosts = {};
    fixedCosts.startCapital = gameValues.startCapital;
    fixedCosts.staff = gameValues.staffCost;
    fixedCosts.facility = gameValues.facilityCost;
    fixedCosts.pricePerPart = gameValues.pricePerPart;
    return fixedCosts;
  }
}

export { Game };
