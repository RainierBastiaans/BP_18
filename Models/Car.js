import { AtWorkstationState } from "./state/car-states/at-workstation-state.js";
import { CarState } from "./state/car-states/car-state.js";
import { InLineForWorkstationState } from "./state/car-states/inline-for-workstation-state.js";
import { ReadyToSellState } from "./state/car-states/ready-to-sell-state.js";
import { SoldState } from "./state/car-states/sold-state.js";
import { WorkingState } from "./state/workstation-states/working-state.js";

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
        const partInfo = {
          name: part.name,
          partAdded: false,
          broken: undefined,
        };
        acc.set(part.name, partInfo);
        return acc;
      }, new Map())
    ); // Initialize an empty Map
  }

  isComplete() {
    this.isBroken = Array.from(this.parts.values()).some(
      (part) => part.broken === true
    );
    if (
      Array.from(this.parts.values()).every((partInfo) => {
        return (
          partInfo.partAdded === true && this.state instanceof ReadyToSellState
        );
      })
    ) {
      this.state = new SoldState();
      return true;
    }
    return;
  }

  getQualityControl() {
    return this.isBroken;
  }

  qualityControl() {
    // Check if all parts marked as added (partAdded === true) are not broken (broken === false)
    const addedParts = Array.from(this.parts.values()).filter(part => part.partAdded === true);
    this.isBroken = !addedParts.every(part => part.broken === false);
  }

  addPart(part, workstation) {
    if (this.state instanceof AtWorkstationState && workstation.state instanceof WorkingState) {
      this.breakPart(part);
      // Check if the part exists in the map (case-sensitive)
      // Update the partAdded property to true for the existing part
      const partInfo = this.parts.get(part);
      partInfo.partAdded = true;
      this.parts.set(part, partInfo);
      this.qualityControl()
    } else {
      throw new Error(
        `Car is not at a workstation, ${part} cannot be added to car ${this.id}.`
      );
    }
  }

  breakPart(part) {
    // Get the part information from the parts list
    const partInfo = this.parts.get(part);

    // Simulate a chance to break with a probability of 0.01
    const isBroken = Math.random() < 0.02;
    partInfo.broken = isBroken;
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
