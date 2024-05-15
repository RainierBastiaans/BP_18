class Car {
  constructor() {
    this.fixedPrice = 2000;
    this.parts = {
      frame: false,
      interior: false,
      door: false,
      window: false,
      tire: false,
    };
  }

  // Method to check if the car is complete
  isComplete() {
    return Object.values(this.parts).every(partComplete => partComplete);
  }
}

export {Car}