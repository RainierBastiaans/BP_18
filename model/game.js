//import basic entities
import { Car } from "./domain/car.js";
import { Workstation } from "./domain/workstation.js";
import { Round } from "./domain/round.js";
import { Money } from "./domain/money.js";
//import "DATABASE"
import data from "./db/parts.json" assert { type: "json" };
//import LEAN METHODS
import { CompositeLeanMethod } from "./domain/lean-methods/composite-lean-method.js";
import { JustInTime } from "./domain/lean-methods/just-in-time.js";
import { QualityControl } from "./domain/lean-methods/quality-control.js";
//import OCCUPANT
import { Bot } from "./domain/occupant/bot.js";
//import STATE

//import STOCK
import { JITStock } from "./domain/stock/jit-stock.js";
import { TraditionalStock } from "./domain/stock/traditional-stock.js";
//import OTHER
import { GameStats } from "./stats/game-stats.js";
import { RoundStats } from "./stats/round-stats.js";

//In essentie is Game onze facade class, die alle andere classes aanroept en de game logica bevat.
//De Game class is een subject klasse en de controller en model klassen zijn observers.
import { CarAtWorkstation } from "./state/car/car-at-workstation.js";
import { CarInLine } from "./state/car/car-inline.js";
import { CarToAssembly } from "./state/car/car-to-assembly.js";
import { CarCheckup } from "./state/car/car-checkup.js";
class Game {
  constructor() {
    this.workstations = new Map();
    this.cost = 0;
    this.rounds = new Map();
    this.carId = 1;
    this.cars = new Map();
    this.parts = data.parts;

    for (let i = 0; i < this.parts.length / 4; i++) {
      const startIndex = i * 4; // Starting index for each workstation (multiples of 4)
      const partList = this.parts.slice(startIndex, startIndex + 4); // Slice the first 4 parts
      this.workstations.set(i + 1, new Workstation(i + 1, partList));
    }

    this.bots = [];
    for (let i = 1; i <= 5; i++) {
      this.bots.push(new Bot(`bot${i}`, i, this));
    }
    this.isOver = false;
    this.leanMethods = new Map();
    this.workstations.get(1).underMaintenance();
  }

  newGame() {
    this.capital = new Money(50000);
    this.stock = new TraditionalStock(this.parts);

    this.observers = [];
  }

  newGame() {
    this.newCar();
    this.newRound();
    this.stats = new GameStats(this);
    this.addObserver(this.stats);
  }

  newRound(leanMethod) {
    const roundnumber = this.rounds.size + 1;
    const roundStats = new RoundStats(roundnumber, this);
    const newRound = new Round(roundStats);
    this.rounds.set(roundnumber, newRound);
    this.currentRound = newRound;
    this.newLeanMethod(leanMethod);
    this.stock.newRound();
    this.bots.forEach((bot) => bot.startWorking());

    this.addObserver(roundStats);
  }

  addObserver(observer) {
    this.observers.push(observer);
  }

  removeObserver(observer) {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  notifyObservers(subject) {
    this.observers.forEach((observer) => observer.update(subject));
  }

  newLeanMethod(method) {
    if (method === "jit") {
      this.leanMethods.set(method, new JustInTime());
      this.stock = new JITStock(this.stock.parts);
    }
    if (method === "qc") {
      this.leanMethods.set(method, new QualityControl());
    }
  }

  moveCar(carToAdd) {
    // Check if carToAdd is a valid Car object
    if (carToAdd instanceof CarCheckup) {
      carToAdd.move(this.cars);
      return;
    }
    if (carToAdd instanceof CarInLine) {
      // Check if a car with the same workstation ID and CarAtWorkstation type already exists
      const existingCar = Array.from(this.cars.values()).find((car) => {
        return (
          car.id != carToAdd.id &&
          car.workstationId === carToAdd.workstationId &&
          car instanceof CarAtWorkstation
        );
      });

      // If no conflicting car exists, add the new CarAtWorkstation
      if (!existingCar) {
        carToAdd.move(this.cars);
      }
    }
  }

  endRound() {
    this.currentRound.endRound();
    this.bots.forEach((bot) => bot.stopAddingParts());
    this.capital.add(this.currentRound.stats.capital);
    if (this.rounds.size === 5) {
      this.endGame();
    }
  }

  newCar() {
    new CarToAssembly(this.cars.size, this.parts, this.cars);
  }

  getCarFromWorkstation(workstationid) {
    // Find the car with matching state
    const matchingCar = Array.from(this.cars.values()).find(
      (car) =>
        car.workstationId === workstationid && car instanceof CarAtWorkstation
    );
    return matchingCar; // Might return undefined if no car is found
  }

  moveWaitingcars() {
    for (const car of this.cars.values()) {
      this.moveCar(car);
    }
    this.newCarAtWorkstation1();
  }

  newCarAtWorkstation1() {
    if (!this.getCarFromWorkstation(1)) {
      this.newCar();
    }
    console.log(this.cars);
  }

  addPart(part, workstationId) {
    this.moveWaitingcars();
    const currentWorkstation = this.workstations.get(workstationId);
    const car = this.getCarFromWorkstation(workstationId);
    try {
      this.stock.requestPart(part);
      this.cars.get(car.id).addPart(part, currentWorkstation);
    } catch (error) {
      console.error(error);
    }
  }

  carCompleted(car) {
    this.stats.updateOnCarCompletion(car);
    this.currentRound.stats.updateOnCarCompletion(car);
  }

  addPartOrMoveBot(workstationId) {
    this.moveWaitingcars();
    const car = this.getCarFromWorkstation(workstationId);
    if (car) {
      const workstation = Array.from(this.workstations.values()).find(
        (workstation) => workstation.id === workstationId
      );
      if (workstation.isComplete(car.parts)) {
        //if car is complete move to next station
        car.move(this.cars);
      } else if (workstation.getIncompletePart(car.parts)) {
        this.addPart(
          workstation.getIncompletePart(car.parts).name,
          workstationId
        );
      }
    }
  }
  endGame() {
    this.isOver = true;
  }
}

export { Game };
