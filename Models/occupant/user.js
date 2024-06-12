import { Occupant } from "./occupant.js";

class User extends Occupant {
  constructor(name) {
    super(name); // Call superclass constructor
  }

  //this class is not being used

  isWorking() {
    // Implement user interaction with the station (e.g., user input)
    //console.log(`${this.name} is working on the station!`);
  }
}

export { User };
