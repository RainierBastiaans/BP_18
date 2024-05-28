import { Car } from "./car.js";

class CarSold extends Car {
  constructor(id, parts) {
    super(id);
    this.parts = parts;
  }

  isComplete() {
    return true;
  }

  move() {
    return this;
  }
}

export { CarSold };
