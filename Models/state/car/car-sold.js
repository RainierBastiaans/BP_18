import { CarState } from "./car-state.js";
import { Car } from "./car.js";

class CarSold extends CarState {
  constructor() {
    super();
  }

  isComplete() {
    return true;
  }

  move() {
    return this;
  }
}

export { CarSold };
