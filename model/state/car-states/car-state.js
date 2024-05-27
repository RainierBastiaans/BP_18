// Base State Class (same as before)
class CarState {
  constructor() {
    if (this.constructor === CarState) {
      throw new Error("Abstract class State cannot be instantiated directly");
    }
  }
}


// Define common methods that all states should implement
  // (e.g., enter(), exit(), handleInput())


export { CarState };
