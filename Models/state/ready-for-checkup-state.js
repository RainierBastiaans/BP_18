import { State } from "./car-state.js";
import { ReadyToSellState } from "./ready-to-sell-state.js";
import { BrokenState } from "./broken-state.js";

class ReadyForCheckupState extends State {
  constructor() {
    super();
  }

  moveWaitingCar(car, cars){
    this.next(car,cars);
  }

  next(car, cars){
    if (!car.isBroken) {
      car.state = new ReadyToSellState();
    } else {
      car.state = new BrokenState();
    }
  }
  enter() {
    console.log("Car is ready for a checkup. Awaiting inspection.");
  }

  exit() {
    console.log("Car has passed the checkup and is ready for sale.");
  }

  handleInput(input) {
    console.log(`Car waiting for checkup received input: ${input}`);
  }
}

export { ReadyForCheckupState };
