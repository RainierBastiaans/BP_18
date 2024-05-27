class Car {
  constructor(id) {
    this.id = id;
    this.fixedPrice = 20000;
  }

  isComplete() {
    // Use the "every" method for concise and efficient checking
    return Array.from(this.parts.values()).every(
      (partInfo) => partInfo.partAdded === true
    );
  }


  qualityControl() {
    throw new Error("Superclass does not have qualityControl");
  }

  // Abstract method - subclasses must implement how to add parts
  addPart(part, workstation) {
    throw new Error("Subclasses must implement addPart method");
  }

  breakPart(part) {
    // Get the part information from the parts list
    const partInfo = this.parts.get(part);

    // Simulate a chance to break with a probability of 0.01
    const isBroken = Math.random() < 0.02;
    partInfo.broken = isBroken;
  }

  move(cars) {
    throw new Error("Subclasses must implement moveCar method");
  }

  isAdded(part) {
    // Check if the part exists in the map
    // Retrieve the part information (optional, if needed later)
    const partInfo = this.parts.get(part);

    // Return the partAdded property (assuming it indicates addition)
    return partInfo && partInfo.partAdded; // Avoid returning undefined if part exists but partAdded is not set
  }
}

export { Car };
