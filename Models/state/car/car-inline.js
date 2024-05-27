import { Car } from "./car.js";
import { CarAtWorkstation } from "./car-at-workstation.js";


class CarInLine extends Car {
    constructor(id, parts, workstationid) {
      super(id);
      this.workstationId = workstationid;
      this.parts = parts
    }
  
    addPart(part) {
      throw new Error(`Can't add ${part} if car is not at workstation`)
    }

    qualityControl(){
        throw new Error('Quality control is not applicable to cars in line')
    }

    move(cars){
        cars.set(this.id, new CarAtWorkstation(this.id, this.parts, this.workstationId))
    }
  
    // ... other methods inherited from Car
  }

  export {CarInLine}