import { State } from "./car-state.js";

class ReadyForCheckupState extends State {
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
