import { Workstation } from "./state/workstation/workstation.js";
import { Round } from "./round.js";
import { Bot } from "./occupant/bot.js";
import data from "../db/parts.json" with { type: "json" };
import availableLeanmethods from "../db/leanmethods.json" with {type: "json"};
import { GameStats } from "./stats/game-stats.js";
import { Money } from "./money.js";
import { RoundStats } from "./stats/round-stats.js";
import { JustInTime } from "../lean-methods/just-in-time.js";
import { QualityControl } from "../lean-methods/quality-control.js";
import { TraditionalStock } from "./stock/traditional-stock.js";
import { JITStock } from "./stock/jit-stock.js";
import { CarAtWorkstation } from "./state/car/car-at-workstation.js";
import { WorkingWorkstation } from "./state/workstation/workstation-working.js";
import { TotalProductiveMaintenance } from "../lean-methods/total-productive-maintenance.js";
import { Car } from "./state/car/car.js";
import { Emitter } from "../emitter.js";
class Game {
  constructor(selectedWorkstation) {
    this.selectedWorkstation = selectedWorkstation
    this.workstations = new Map();
    this.rounds = new Map();
    this.carId = 1;
    this.cars = new Map();
    this.parts = data.parts;
    this.leanMethods = new Map();
    this.availableLeanmethods = availableLeanmethods.leanMethods;

    this.createOrRefreshWorkstations();
    this.bots = [];
    // Create bots only for workstations other than selectedWorkstation
    for (let i = 1; i <= 5; i++) {
      if (i !== parseInt(selectedWorkstation)) {
        this.bots.push(new Bot(`bot${i}`, i, this));
      }
    }
    this.isOver = false;
    this.newGame()
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
          this.leanMethods.get("total_productive_maintenance")
        )
      );
    }
  }
  newGame() {
    this.stats = new GameStats(this);
    this.stock = new TraditionalStock(this.stats, this.parts);
    this.newCar();
    this.newRound();
  }

  newRound(leanMethod) {
    const roundnumber = this.rounds.size + 1;
    const newRound = new Round();
    this.stats.newRound();
    this.rounds.set(roundnumber, newRound);
    this.currentRound = newRound;
    this.newLeanMethod(leanMethod);
    this.stock.newRound();
    this.bots.forEach((bot) => bot.startWorking());
    this.createOrRefreshWorkstations();
    this.currentRound.emitter.on("roundoverInModel", () => {
      this.endRound()
    });
  }

  newLeanMethod(method) {
    if (method === "just_in_time") {
      this.leanMethods.set(method, new JustInTime());
      this.stock = new JITStock(this.stats, this.stock.parts);
    }
    if (method === "total_quality_control") {
      this.leanMethods.set(method, new QualityControl());
    }
    if (method === "total_productive_maintenance") {
      this.leanMethods.set(
        method,
        new TotalProductiveMaintenance(this.workstations)
      );
    }
  }

  moveCar(carToAdd) {
    return carToAdd.move(this.cars, this.workstations);
  }

  endRound() {
    this.bots.forEach((bot) => bot.stopAddingParts());
    if (this.rounds.size === 5) {
      this.endGame();
    }
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
      currentWorkstation.addPartToCar(this.workstations);
      this.stock.requestPart(part);
      this.cars.get(car.id).addPart(part, currentWorkstation);
    } catch (error) {
      //console.error(error);
    }
  }

  
  manualMove(car){
    car.manualMove(this.cars,this.workstations)
  }
  
  endGame() {
    this.isOver = true;
  }
}

export { Game };
