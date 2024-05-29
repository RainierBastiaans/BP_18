import { CarAtWorkstation } from "./car-at-workstation.js";

class Car {
  constructor(id, parts) {
    this.id = id;
    this.fixedPrice = 20000;
    this.state = new CarAtWorkstation(1);
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
    this.state.isComplete();
  }

  qualityControl() {
    this.state.qualityControl(this.parts);
  }

  // Abstract method - subclasses must implement how to add parts
  addPart(partsToAdd) {
    this.parts = this.state.addPart(this.parts, partsToAdd);
  }

  move(cars) {
    this.state = this.state.move(cars, this.parts);
  }

  manualMove(cars, workstations){
    this.state = this.state.manualMove(this.parts,workstations)
  }

  remove(cars){
    this.state = this.state.remove(cars)
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
