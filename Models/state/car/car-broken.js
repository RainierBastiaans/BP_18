import { CarState } from "./car-state.js";
import { Car } from "./car.js";


class CarBroken extends CarState {
    constructor() {
      super();
    }

    move(){
        return this;
    }
}

export {CarBroken}