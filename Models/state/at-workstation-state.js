import { State } from "./car-state.js";
import { InLineForWorkstationState } from "./inline-for-workstation-state.js";

class AtWorkstationState extends State {
  constructor(workstationId) {
    super();
    this.workstationId = workstationId;
  }

  enter() {
    //console.log(`Car is already at workstation ${this.workstationId}. Work in progress.`);
  }
  next(car, cars) {
    //console.log(`Car exited workstation ${this.workstationId}. Work completed. Now in line`);
    car.state = new InLineForWorkstationState(car.state.workstationId + 1);
  }

  moveWaitingCar(car, cars) {
    return;
  }

  handleInput(input) {
    //console.log(`Handling input '${input}' at workstation ${this.workstationId}`);
  }
}
export { AtWorkstationState };

