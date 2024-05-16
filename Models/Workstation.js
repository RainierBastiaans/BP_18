import { Part } from "./part.js";

class Workstation {
  constructor(id, partsList) {
    this.id = id;
    this.parts = partsList.map(partData => new Part(partData.name, partData.price)); // Create Part objects from data
  }
}

export { Workstation };