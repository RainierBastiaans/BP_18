import { CarState } from "./car-state.js";
import { InLineForWorkstationState } from "./inline-for-workstation-state.js";
import { ReadyForCheckupState } from "./ready-for-checkup-state.js";

class AtWorkstationState extends CarState {
  constructor(workstationId) {
    super();
    this.workstationId = workstationId;
  }

  enter() {
    console.log(
      `Car is already at workstation ${this.workstationId}. Work in progress.`
    );
  }
  next(car, cars) {
    console.log(
      `Car exited workstation ${this.workstationId}. Work completed. Now in line`
    );
    if (car.state.workstationId < 5) {
      car.state = new InLineForWorkstationState(car.state.workstationId + 1);
    } else {
      car.state = new ReadyForCheckupState();
    }
  }

  moveWaitingCar(car, cars) {
    return;
  }

  handleInput(input) {
    console.log(
      `Handling input '${input}' at workstation ${this.workstationId}`
    );
  }
}
export { AtWorkstationState };
