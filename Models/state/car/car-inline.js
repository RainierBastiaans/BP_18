import { Car } from "./car.js";
import { CarAtWorkstation } from "./car-at-workstation.js";
import { CarState } from "./car-state.js";


class CarInLine extends CarState {
    constructor(workstationid) {
      super();
      this.workstationId = workstationid;
    }
  
    addPart(part) {
      throw new Error(`Can't add ${part} if car is not at workstation`)
    }

  qualityControl() {
    throw new Error("Quality control is not applicable to cars in line");
  }

  inProgress(){
    return true;
  }

  move(cars) {
    // Check if a car with the same workstation ID and CarAtWorkstation type already exists
    const existingCar = Array.from(cars.values()).find((car) => {
      return (
        car.id != this.id &&
        car.workstationId === this.workstationId &&
        car instanceof CarAtWorkstation
      );
    });

      // If no conflicting car exists, add the new CarAtWorkstation
      if (!existingCar) {
        return new CarAtWorkstation( this.workstationId)
      }
      return this;
    }
    isComplete() {
      return false;
    }
    isBroken() {
      return false;
    }
  
    // ... other methods inherited from Car
  }

export { CarInLine };
