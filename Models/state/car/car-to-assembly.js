import { CarAtWorkstation } from "./car-at-workstation.js";
import { Car } from "./car.js";

class CarToAssembly extends Car {
  constructor(id, parts, cars) {
    super(id);
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
    cars.set(id, new CarAtWorkstation(id, this.parts, 1));
  }
  move(){
    return;
  }
}

export { CarToAssembly };
