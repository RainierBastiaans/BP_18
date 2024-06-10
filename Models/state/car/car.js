import { Subject } from "../../../subject.js";
import { CarAtWorkstation } from "./car-at-workstation.js";

class Car extends Subject {
  constructor(id, parts,stats) {
    super();
    this.id = id;
    this.fixedPrice = 20000;
    this.addObserver(stats)
    this.state = new CarAtWorkstation(1);
    // Create the parts map with key as part name and value as object with properties
    this.parts = new Map(
      parts.reduce((acc, part) => {
        // Ensure each part is an object with a "name" property
        if (!part || !part.id) {
          console.warn("Warning: Ignoring invalid part in parts array:", part);
          return acc; // Skip invalid parts
        }

        // Create a new object with partAdded and broken properties
        const partInfo = {
          name: part.id,
          partAdded: false,
          broken: undefined,
        };
        acc.set(part.id, partInfo);
        return acc;
      }, new Map())
    ); // Initialize an empty Map

  }
  inProgress(){
    return this.state.inProgress()
  }

  set state(newState) {
    if (this._state !== newState) {
      this._state = newState;
      this.notifyObservers(this, "car");
    }
  }
  get state(){
    return this._state
  }

  isComplete() {
    return this.state.isComplete();
  }

  isBroken() {
    return this.state.isBroken();
  }

  qualityControl() {
    this.state.qualityControl(this.parts);
  }

  addPart(partsToAdd, leanMethodService) {
    this.parts = this.state.addPart(this.parts, partsToAdd, leanMethodService);
  }

  move(cars) {
    this.state =this.state.move(cars, this.parts);
  }

  manualMove(cars, workstations) {
    this.state = this.state.manualMove(this.parts, workstations);
  }

  remove() {
    this.state = this.state.remove();
  }

  isAdded(part) {
    // Check if the part exists in the map
    // Retrieve the part information (optional, if needed later)
    const partInfo = this.parts.get(part);

    // Return the partAdded property (assuming it indicates addition)
    return partInfo && partInfo.partAdded; // Avoid returning undefined if part exists but partAdded is not set
  }
  getQualityControlValue() {
    return this.state.qualityControlValue;
  }
}

export { Car };
