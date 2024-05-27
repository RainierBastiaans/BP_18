import { CarCheckup } from "./car-checkup.js";
import { CarInLine } from "./car-inline.js";
import { Car } from "../../car.js";

class CarAtWorkstation extends Car {
  constructor(id, parts, workstationid) {
    super(id);
    this.workstationId = workstationid;
    this.parts = parts;
  }

  addPart(part) {
    this.breakPart(part);
    // Check if the part exists in the map (case-sensitive)
    // Update the partAdded property to true for the existing part
    const partInfo = this.parts.get(part);
    partInfo.partAdded = true;
    this.parts.set(part, partInfo);
  }

  qualityControl() {
    // Check if all parts marked as added (partAdded === true) are not broken (broken === false)
    const addedParts = Array.from(this.parts.values()).filter(
      (part) => part.partAdded === true
    );
    return !addedParts.every((part) => part.broken === false);
  }

  move(cars) {
    if (this.workstationId >= 5) {
      cars.set(this.id, new CarCheckup(this.id, this.parts, cars));
    } else {
      cars.set(
        this.id,
        new CarInLine(this.id, this.parts, this.workstationId + 1)
      );
    }
  }

  // ... other methods inherited from Car
}

export { CarAtWorkstation };
