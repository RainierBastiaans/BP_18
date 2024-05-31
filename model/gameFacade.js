import { Game } from "./game.js";
import { Car } from "./domain/car.js";
import { Part } from "./domain/part.js";
import { Workstation } from "./domain/workstation.js";

class GameFacade {
  constructor() {
    this.game = new Game();
    this.timeLeft = 180; // Time in seconds
    this.timerInterval = null;
  }

  configureGame(options) {
    // Configure game with options, ready to play
    this.game.newGame();
    this.game.setOptions(options);
    this.game.createOrRefreshWorkstations();
  }

  startGame() {}

  startNewRound() {}

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

  endGame() {}

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
    // Logic to move car to next station
  }

  performQualityControl() {
    // Logic to perform quality control
  }

  getCurrentMessage() {
    return `Work on workstation ${this.currentWorkstationIndex}`;
  }

  getWorkstationStatus() {
    const currentWorkstation =
      this.workstations[this.currentWorkstationIndex - 1];
    return {
      isUnderMaintenance: currentWorkstation.isUnderMaintenance,
      seconds: currentWorkstation.maintenanceTimeLeft,
    };
  }

  isRoundOver() {
    return this.game.currentRound.isOver;
  }

  getCarStatus() {
    // Return current car status
    return {};
  }

  getQualityControlStatus() {
    // Return current quality control status
    return {};
  }
}

export default GameFacade;
