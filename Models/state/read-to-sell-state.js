import { State } from "./car-state.js";

class ReadyToSellState extends State {
  enter() {
    console.log("Car is ready for sale. Put it on the showroom floor!");
  }

  exit() {
    console.log("Car has been sold! Congratulations!");
  }

  handleInput(input) {
    console.log(`Car ready for sale received input: ${input}`);
  }
}

export { ReadyToSellState };