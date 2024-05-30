class CarState {
  constructor() {
    this.qualityControlValue;
  }

  isComplete() {
    throw new Error("SuperClass");
  }

  isBroken() {
    throw new Error("SuperClass");
  }

  move() {
    throw new Error("SuperClass");
  }

  addPart(parts, partToAdd) {
    throw new Error("SuperClass");
  }

  qualityControl(parts) {
    throw new Error("SuperClass");
  }

  move(cars, workstations) {
    throw new Error("SuperClass");
  }
  manualMove(cars, workstations) {
    throw new Error("SuperClass");
  }
  remove() {
    throw new Error("SuperClass");
  }

  breakPart(part) {
    throw new Error("SuperClass");
  }
}

export { CarState };
