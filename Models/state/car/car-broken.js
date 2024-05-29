import { Car } from "./car.js";

class CarBroken extends Car {
  constructor(id, parts) {
    super(id);
    this.parts = parts;
  }

  move() {
    return;
  }
}

export { CarBroken };
