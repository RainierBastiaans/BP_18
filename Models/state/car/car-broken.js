import { CarState } from "./car-state.js";
import { Car } from "./car.js";

class CarBroken extends CarState {
  constructor() {
    super();
  }

  move() {
    return this;
  }

  isComplete() {
    return false;
  }

  isBroken() {
    return true;
  }
  inProgress() {
    return false;
  }
}

export { CarBroken };
