import { Car } from "../../car.js";

class CarSold extends Car {
  constructor(id, parts) {
    super(id);
    this.parts = parts;
  }

  move() {
    throw new Error("carsold cannot be moved");
  }
}

export { CarSold };
