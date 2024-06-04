class Occupant {
  constructor(name, workstationId, game) {
    this.name = name;
    this.workstationId = workstationId;
    this.game = game;
  }

  isWorking() {
    // Override this method in User or Bot to define their working behavior
    throw new Error("isWorking() not implemented in Occupant!");
  }
}

export { Occupant };
