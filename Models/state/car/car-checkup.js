import { CarSold } from "./car-sold.js";
import { CarBroken } from "./car-broken.js";
import { Car } from "./car.js";

class CarCheckup extends Car {
    constructor(id, parts) {
      super(id);
      this.parts = parts
      
    }

    qualityControl() {
      // Check if all parts marked as added (partAdded === true) are not broken (broken === false)
      const addedParts = Array.from(this.parts.values()).filter(part => part.partAdded === true);
      return !addedParts.every(part => part.broken === false);
    }

    move(cars){
      if (!this.qualityControl()) {
        cars.set(this.id, new CarSold(this.id, this.parts));
      } else {
        cars.set(this.id, new CarBroken(this.id, this.parts));
      }
    }
}

export {CarCheckup}