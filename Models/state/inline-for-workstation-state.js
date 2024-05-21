import { AtWorkstationState } from "./at-workstation-state.js";
import { State } from "./car-state.js";

class InLineForWorkstationState extends State {
  constructor(workstationId) {
    super();
    this.workstationId = workstationId || null; // Optional workstation ID when in line
  }
  enter() {
    console.log("Car is in line for a workstation.");
  }

  next(car, cars) {
    // Find available workstation with matching ID (if specified)
    const availableWorkstation = Array.from(cars.values()).find(
      (otherCar) =>
        otherCar.state instanceof AtWorkstationState &&
        otherCar.state.workstationId === this.workstationId
    );
    if (!(availableWorkstation)) {
      car.state = new AtWorkstationState(
        this.workstationId
      );
    } else {
      // Remain in the same state (no available workstation)
      return this;
    }
  }

  moveWaitingCar(car, cars){
    this.next(car,cars);
  }

  exit() {
    console.log("Car has left the in-line queue and moved to a workstation.");
  }

  handleInput(input) {
    console.log(`Car in line received input: ${input}`);
  }
}

export { InLineForWorkstationState };
