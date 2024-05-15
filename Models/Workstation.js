import { Part } from "./part.js";

class Workstation {
  constructor(id, part) {
    this.id = id;
    this.completed = false;
    this.part = new Part(part,0);
  }
}

export { Workstation };
