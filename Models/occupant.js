class Occupant {
    constructor(name, workstation) {
      this.name = name;
      this.workstation = workstation
    }
  
    isWorking() {
      // Override this method in User or Bot to define their working behavior
      throw new Error("isWorking() not implemented in Occupant!");
    }
  }
  
  export { Occupant }