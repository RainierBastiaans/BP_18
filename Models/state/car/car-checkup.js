import { CarSold } from "./car-sold.js";
import { CarBroken } from "./car-broken.js";
import { Car } from "./car.js";
import { CarState } from "./car-state.js";

class CarCheckup extends CarState {
    constructor() {
      super();
      
    }

    qualityControl(parts) {
      return Array.from(parts.values()).every(part => part.broken === false)
    }

    move(cars, parts){
      if (this.qualityControl(parts)) {
        return new CarSold();
      } else {
        return new CarBroken();
      }
    }
}

export {CarCheckup}