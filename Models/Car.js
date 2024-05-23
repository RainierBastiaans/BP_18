import { AtWorkstationState } from "./state/at-workstation-state.js";
import { State } from "./state/car-state.js";
import { InLineForWorkstationState } from "./state/inline-for-workstation-state.js";

class Car {
  constructor(id, parts) {
    this.id = id;
    this.fixedPrice = 20000;
    this.state = new AtWorkstationState(1);

    // Create the parts map with key as part name and value as object with properties
    this.parts = new Map(
      parts.reduce((acc, part) => {
        // Ensure each part is an object with a "name" property
        if (!part || !part.name) {
          console.warn("Warning: Ignoring invalid part in parts array:", part);
          return acc; // Skip invalid parts
        }

        // Create a new object with partAdded and broken properties
        const partInfo = { name: part.name, partAdded: false, broken: undefined };
        acc.set(part.name, partInfo);
        return acc;
      }, new Map())
    ); // Initialize an empty Map
  }

  isComplete() {
    // Check if all parts in the map have both "partAdded" set to true and "broken" set to false
    return Array.from(this.parts.values()).every((partInfo) => {
      return partInfo.partAdded === true && partInfo.broken === false;
    });
  }

  addPart(part) {
    if (this.state instanceof AtWorkstationState) {
      // Check if the part exists in the map (case-sensitive)
      // Update the partAdded property to true for the existing part
      const partInfo = this.parts.get(part);
      partInfo.partAdded = true;
      this.parts.set(part, partInfo);
    } else {
      throw new Error("Car is not at a workstation, part cannot be added.");
    }
  }

  moveCar(cars) {
    this.state.next(this, cars);
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
