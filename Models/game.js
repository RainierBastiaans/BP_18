import { Car } from "./car.js";
import { Workstation } from "./workstation.js";

class Game {
  constructor() {
    this.workstations;
    this.capital = 0;
    this.cost = 0;
    this.completedCars = 0;
    this.carId = 1;
    this.cars = new Map();
    this.parts = [
      { name: "chassis" },
      { name: "hood" },
      { name: "trunk" },
      { name: "door" }, // Single door assumed, adjust for multiple doors if needed
      { name: "engineBlock" },
      { name: "cylinderHead" },
      { name: "piston" }, // Quantity tracking might be needed later, adjust if applicable
      { name: "sparkPlugs" }, // Can be a boolean for a set
      { name: "dashboard" },
      { name: "seat" }, // Quantity tracking might be needed later, adjust if applicable
      { name: "steeringWheel" },
      { name: "carpet" },
      { name: "battery" },
      { name: "alternator" },
      { name: "headlights" }, // Can be a boolean for a pair
      { name: "wiringHarness" },
      { name: "tire" }, // Quantity tracking might be needed later, adjust if applicable
      { name: "wheel" }, // Quantity tracking might be needed later, adjust if applicable
      { name: "hubcap" }, // Can be a boolean for a set of 4
      { name: "brakePads" }, // Can be a boolean for a set of 4
    ];
  }

  newCar() {
    const car = new Car(this.carId, this.parts);
    this.cars.set(car.id,car);
    this.carId++;
  }

  

  getCarFromWorkstation(workstation) {
    // Find the car with matching state
    const matchingCar = Array.from(this.cars.values()).find(
      (car) => car.state.workstationId === workstation.id
    );

    return matchingCar; // Might return undefined if no car is found
  }


  moveWaitingcars(){
    for (const car of this.cars.values()) {
      car.state.moveWaitingCar(car, this.cars)
    }
    console.log(this.cars)
  }

  newCarAtWorkstation1(){
    if (!(this.getCarFromWorkstation(1))){
      this.newCar()
    }
  }
}

export { Game };
