import { CarAtWorkstation } from "./car-at-workstation.js";
import { CarState } from "./car-state.js";
import { Car } from "./car.js";

class CarToAssembly extends CarState {
  constructor() {
    super();
    
  }
  move(){
    return;
  }
}

export { CarToAssembly };
