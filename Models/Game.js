import { Car } from "./car.js";
import { Workstation } from "./workstation.js";
import { Stock } from "./Stock.js";
import { Round } from "./Round.js";
import { Bot } from "./bot.js";
import data from "../db/parts.json" assert { type: "json" };
import { GameStats } from "./stats/game-stats.js";
import { Money } from "./money.js";
import { RoundStats } from "./stats/round-stats.js";

class Game {
  constructor() {
    this.workstations = new Map();
    this.cost = 0;
    this.rounds = new Map();
    this.carId = 1;
    this.cars = new Map();
    this.parts = data.parts;

    // [
    //   { name: "chassis" },
    //   { name: "hood" },
    //   { name: "trunk" },
    //   { name: "door" }, // Single door assumed, adjust for multiple doors if needed
    //   { name: "engineBlock" },
    //   { name: "cylinderHead" },
    //   { name: "piston" }, // Quantity tracking might be needed later, adjust if applicable
    //   { name: "sparkPlugs" }, // Can be a boolean for a set
    //   { name: "dashboard" },
    //   { name: "seat" }, // Quantity tracking might be needed later, adjust if applicable
    //   { name: "steeringWheel" },
    //   { name: "carpet" },
    //   { name: "battery" },
    //   { name: "alternator" },
    //   { name: "headlights" }, // Can be a boolean for a pair
    //   { name: "wiringHarness" },
    //   { name: "tire" }, // Quantity tracking might be needed later, adjust if applicable
    //   { name: "wheel" }, // Quantity tracking might be needed later, adjust if applicable
    //   { name: "hubcap" }, // Can be a boolean for a set of 4
    //   { name: "brakePads" }, // Can be a boolean for a set of 4
    // ];

    this.stock = new Stock(this.parts);
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
    this.capital = new Money(50000); // Use Money class
  }

  newGame() {
    this.newCar();
    this.newRound();
    this.stats = new GameStats(this);
  }

  newRound() {
    const roundnumber = this.rounds.size + 1;
    const newRound = new Round(new RoundStats(roundnumber, this));
    this.rounds.set(roundnumber, newRound);
    this.currentRound = newRound;
    this.stock.newRound();
    this.bots.forEach((bot) => bot.startWorking());
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
    const car = new Car(this.carId, this.parts);
    this.cars.set(car.id, car);
    this.carId++;
  }

  getCarFromWorkstation(workstationid) {
    // Find the car with matching state
    const matchingCar = Array.from(this.cars.values()).find(
      (car) => car.state.workstationId === workstationid
    );

    return matchingCar; // Might return undefined if no car is found
  }

  moveWaitingcars() {
    for (const car of this.cars.values()) {
      car.state.moveWaitingCar(car, this.cars);
    }
    this.newCarAtWorkstation1();
  }

  newCarAtWorkstation1() {
    if (!this.getCarFromWorkstation(1)) {
      this.newCar();
    }
  }

  addPart(part, workstationId) {
    const car = this.getCarFromWorkstation(workstationId);
    if (this.stock.hasEnoughParts(part)) {
      this.cars.get(car.id).addPart(part);
      this.stock.usePart(part);
    }

    if (car.isComplete()) {
      this.carCompleted(car);
    }
  }

  carCompleted(car) {
    this.stats.updateOnCarCompletion(car);
    this.currentRound.stats.updateOnCarCompletion(car);
  }

  addPartOrMoveBot(workstationId) {
    const car = this.getCarFromWorkstation(workstationId);
    if (this.getCarFromWorkstation(workstationId)) {
      const workstation = Array.from(this.workstations.values()).find(
        (workstation) => workstation.id === workstationId
      );
      if (workstation.isComplete(car.parts)) {
        //if car is complete move to next station
        car.moveCar(this.cars);
        this.moveWaitingcars();
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
