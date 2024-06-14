import { CarState } from "./car-state.js";
import { Car } from "./car.js";

class CarSold extends CarState {
  constructor() {
    super();
  }

  isComplete() {
    return true;
  }

  isBroken() {
    return false;
  }
  move() {
    return this;
  }
  inProgress() {
    return false;
  }
}

export { CarSold };
