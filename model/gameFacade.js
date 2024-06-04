import { Game } from "./game.js";
import { Car } from "./domain/car.js";
import { Part } from "./domain/part.js";
import { Workstation } from "./domain/workstation.js";

class GameFacade {
  constructor() {
    this.game = new Game();
    this.timeLeft = 180; // Time in seconds
    this.timerInterval = null;
    this.currentWorkstationIndex = 1;
  }

  configureGame() {
    // Configure game with options, ready to play
    this.game.newGame();
    this.game.createOrRefreshWorkstations();
  }

  endRound() {
    if (this.game.isOver) {
      this.game.endGame();
      return;
    }

    this.game.endRound();
  }

  getGameDetails() {
    return {
      gameStats: this.game.stats,
      roundStats: this.game.currentRound.stats,
      capital: this.game.capital,
    };
  }

  goToPreviousWorkstation() {
    if (this.currentWorkstationIndex > 1) {
      this.currentWorkstationIndex--;
    }
  }

  goToNextWorkstation() {
    if (this.currentWorkstationIndex < this.workstations.length) {
      this.currentWorkstationIndex++;
    }
  }

  moveCarToNextStation() {
    this.game
      .getCarFromWorkstation(this.getCurrentWorkstationIndex())
      .manualMove(this.game.cars, this.game.workstations);
    this.game.moveCar();
  }

  performQualityControl() {
    // Logic to perform quality control
  }

  getCurrentMessage() {
    return `Work on workstation ${this.currentWorkstationIndex}`;
  }

  getCurrentWorkstation() {
    return this.game.workstations.get(this.currentWorkstationIndex);
  }

  getPartNames() {
    return this.getCurrentWorkstation().getPartNames();
  }

  getCurrentWorkstationIndex() {
    return this.currentWorkstationIndex;
  }

  getTotalWorkstations() {
    return this.game.workstations.size;
  }

  getAmountCarsCompleted() {
    this.game.stats.carsCompleted;
  }

  // getWorkstationStatus() {
  //   const currentWorkstation =
  //     this.game.workstations[this.currentWorkstationIndex - 1];
  //   console.log("hallo" + currentWorkstation);
  //   return {
  //     isUnderMaintenance: currentWorkstation.isUnderMaintenance,
  //     seconds: currentWorkstation.maintenanceTimeLeft,
  //   };
  // }

  isRoundOver() {
    console.log(this.game.rounds.size);
    const currentRound = this.game.getCurrentRound;
  }

  getCarStatus() {
    // Return current car status
    return {};
  }

  getQualityControlStatus() {
    // Return current quality control status
    return {};
  }

  addPart(partName, workstationId) {
    this.game.addPart(partName, workstationId);
    // this.updateMessage();
    // this.updateQualityControlButton();
  }

  isPartAdded(partName) {
    this.game.isPartAdded(partName);
  }

  getCarFromWorkstation(workstationId) {
    return this.game.getCarFromWorkstation(workstationId);
  }

  isCarComplete(car) {
    return this.game.isCarComplete(car);
  }
}

export default GameFacade;
