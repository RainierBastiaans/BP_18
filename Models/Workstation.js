import { Part } from "./Part.js";

class Workstation {
  constructor(id, part) {
    this.id = id;
    this.part = new Part(part,0);
  }
}

export { Workstation };
