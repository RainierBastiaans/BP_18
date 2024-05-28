import GameFacade from "../model/gameFacade";
import

// gameController.js
class GameController {
  constructor(elements) {
    this.gameFacade = new GameFacade();

    this.previousButton = elements[0];
    this.nextButton = elements[1];
    this.moveCarButton = elements[2];
    this.qualityControlButton = elements[3];
    // Add event listeners for game controls
    this.addEventListeners();
  }

  addEventListeners() {
    this.previousButton.addEventListener("click", this.handleClick.bind(this));
    this.nextButton.addEventListener("click", this.handleClick.bind(this));
    this.moveCarButton.addEventListener("click", this.handleClick.bind(this));
    this.qualityControlButton.addEventListener(
      "click",
      this.handleClick.bind(this)
    );
  }

  handleClick(event) {
    const target = event.target;
    if (target.classList.contains("part-button")) {
      this.handlePartButtonClick(target);
    } else if (target === this.gameFacade.previousButton) {
      this.gameFacade.goToPreviousWorkstation();
    } else if (target === this.gameFacade.nextButton) {
      this.gameFacade.goToNextWorkstation();
    } else if (target === this.gameFacade.moveCarButton) {
      this.gameFacade.moveCar();
    } else if (target === this.gameFacade.qualityControlButton) {
      this.gameFacade.qualityControl();
    }
  }

  handlePartButtonClick(button) {
    const partName = button.dataset.partName;
    const workstationId = this.getCurrentWorkstationId();
    this.gameFacade.addPart(
      partName,
      workstationId
    );
    this.gameFacade.updateMessage();
    this.gameFacade.updateQualityControlButton();
  }

  goToPreviousWorkstation() {
    // Logic to handle going to the previous workstation
  }

  goToNextWorkstation() {
    // Logic to handle going to the next workstation
  }

  moveCar() {
    this.gameFacade.getCarFromWorkstation(this.getCurrentWorkstationId()).move(this.gameFacade.cars);
  }

  qualityControl() {
    // Logic to handle quality control
  }

  getCurrentWorkstation() {
    return this.gameFacade.getCurrentWorkstation();
  }

  getCurrentWorkstationId() {
    return this.getCurrentWorkstation().id;
  }

  getCarFromWorkstation(id){
    return this.gameFacade.getCarFromWorkstation(id);
  }

  getCarFromCurrentWorkstation() {
    const id = this.getCurrentWorkstationId();
    return this.getCarFromWorkstation(id);
  }

  getQualityControl() {
    return this.getCarFromWorkstation(this.getCurrentWorkstationId()).qualityControl;
  }

  isUnderMaintenance() {
    return this.getCurrentWorkstation().isUnderMaintenance();
  }

  getRemainingMaintenanceTime() {
    return this.getCurrentWorkstation().getRemainingMaintenanceTime();
  }

  endRound() {
    this.gameFacade.endRound();
  }

  isRoundOver() {
    return this.gameFacade.isRoundOver();
  }

  isGameOver() {
    return this.gameFacade.isGameOver();
  }

  getGameStats() {
    return this.gameFacade.getGameStats();
  }

  getRoundStats() {
    return this.gameFacade.getRoundStats();
  }

  getCapital() {
    return this.gameFacade.getCapital();
    //getCapital.amount
  }

  getAmountCarsCompleted() {
    return this.gameFacade.getAmountCarsCompleted();
  } 

  getPartNames() {
    return this.gameFacade.getPartNames();
    //field from currentworkstation!
  }

  isPartAdded(partName) {    
    return this.gameFacade.isPartAdded(partName);
    //to car of current workstation!
  }

  hasLeanMethod(leanMethod) {
    return this.gameFacade.hasLeanMethod(leanMethod);
  }

  isCarComplete() {
    const car = this.getCarFromCurrentWorkstation();
    return this.gameFacade.isCarComplete(car.parts);
    //from currentworkstation!
  }

  getWorkstationSize() {
    return this.gameFacade.getWorkstationSize();
    //=field in workstation!
  }


}

export { GameController };
