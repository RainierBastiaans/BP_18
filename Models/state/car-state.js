// Base State Class (same as before)
class State {
  constructor() {
    if (this.constructor === State) {
      throw new Error("Abstract class State cannot be instantiated directly");
    }
  }
}


// Define common methods that all states should implement
  // (e.g., enter(), exit(), handleInput())


export { State };
