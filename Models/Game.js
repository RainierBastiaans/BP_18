class Game {
  constructor() {
    this.capital = 0;
    this.cost = 0;
    this.completedCars = 0
    this.parts = [
      { name: "chassis" },
      { name: "hood" },
      { name: "trunk" },
      { name: "door" }, // Single door assumed, adjust for multiple doors if needed
      { name: "engineBlock" },
      { name: "cylinderHead" },
      { name: "piston" }, // Quantity tracking might be needed later, adjust if applicable
      { name: "sparkPlugs" }, // Can be a boolean for a set
      { name: "dashboard" },
      { name: "seat" }, // Quantity tracking might be needed later, adjust if applicable
      { name: "steeringWheel" },
      { name: "carpet" },
      { name: "battery" },
      { name: "alternator" },
      { name: "headlights" }, // Can be a boolean for a pair
      { name: "wiringHarness" },
      { name: "tire" }, // Quantity tracking might be needed later, adjust if applicable
      { name: "wheel" }, // Quantity tracking might be needed later, adjust if applicable
      { name: "hubcap" }, // Can be a boolean for a set of 4
      { name: "brakePads" }, // Can be a boolean for a set of 4
    ];
  }
}

export { Game };
