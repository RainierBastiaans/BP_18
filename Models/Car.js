class Car {
  constructor(parts) {
    this.fixedPrice = 2000;
    
    // Create the parts dictionary from the provided parts
    this.parts = parts.reduce((acc, part) => {
      // Ensure each part is an object with a "name" property
      if (!part || !part.name) {
        console.warn("Warning: Ignoring invalid part in parts array:", part);
        return acc; // Skip invalid parts
      }
      acc[part.name] = false; // Initialize presence as false
      return acc;
    }, {});
  }

  // Method to check if the car is complete
  isComplete() {
    return Object.values(this.parts).every((partComplete) => partComplete);
  }

  addPart(part) {
    if (part in this.parts) {
      this.parts[part] = true;
    } else {
      throw new Error(`Invalid part name: ${part}`);
    }
  }

  isAdded(part) {
    return this.parts[part.name];
  }
}

export { Car };
