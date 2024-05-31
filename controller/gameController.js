class GameController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    //Bind the eventlisteners of the view to the controller
    this.bindEventListeners();

    this.init();
  }

  show() {
    this.view.show();
  }

  hide() {
    this.view.hide();
  }

  init() {
    this.view.updateMessage(this.model.getCurrentMessage());
    this.show();
    this.view.connectedCallback();
    this.updateButtonsState();
  }

  bindEventListeners() {
    this.view.bindPreviousButtonClick(this.handlePreviousButton);
    this.view.bindNextButtonClick(this.handleNextButton);
    this.view.bindMoveCarButtonClick(this.handleMoveCarButton);
    this.view.bindQualityControlButtonClick(this.handleQualityControlButton);
    this.view.bindCheckRoundOver(this.checkRoundOver);
    this.view.bindPartButtonClick(this.handlePartButtonClick);
  }

  handlePreviousButton = () => {
    console.log("Previous button clicked");
    // Logic for handling previous button click
    this.model.goToPreviousWorkstation();
    this.updateView();
  };

  handleNextButton = () => {
    console.log("Next button clicked");
    // Logic for handling next button click
    this.model.goToNextWorkstation();
    this.updateView();
  };

  handleMoveCarButton = () => {
    console.log("Move car button clicked");
    // Logic for handling move car button click
    this.model.moveCarToNextStation();
    this.updateView();
    this.view.updateCarStatus(this.model.getCarStatus());
  };

  handleQualityControlButton = () => {
    console.log("Quality control button clicked");
    // Logic for handling quality control button click
    this.model.performQualityControl();
    this.updateView();
    this.view.updateQualityControl(this.model.getQualityControlStatus());
  };

  checkRoundOver = () => {
    if (this.model.isRoundOver()) {
      this.endRound();
    }
  };

  handlePartButtonClick(button) {
    const partName = button.dataset.partName;
    const workstationId = this.getCurrentWorkstationId();
    this.model.addPart(partName, workstationId);
    this.updatePartsAdded(this.model.getPartsAdded());
  }

  updateView() {
    this.view.updateMessage(this.model.getCurrentMessage());
    this.view.draw(this.model.getWorkstationStatus());
    this.updateButtonsState();
  }

  updateButtonsState() {
    const currentIndex = this.model.getCurrentWorkstationIndex();
    const totalWorkstations = this.model.getTotalWorkstations();

    this.view.previousButton.disabled = currentIndex === 0;
    this.view.nextButton.disabled = currentIndex === totalWorkstations - 1;

    const isQualityControlVisible = this.model.shouldShowQualityControl();
    this.view.qualityControlButton.style.visibility = isQualityControlVisible
      ? "visible"
      : "hidden";
  }

  moveCar() {
    this.model.moveCarToNextStation();
  }

  qualityControl() {
    // Logic to handle quality control
  }

  getCurrentWorkstation() {
    return this.model.getCurrentWorkstation();
  }

  getCurrentWorkstationId() {
    return this.getCurrentWorkstation().id;
  }

  getCarFromWorkstation(id) {
    return this.model.getCarFromWorkstation(id);
  }

  getCarFromCurrentWorkstation() {
    const id = this.getCurrentWorkstationId();
    return this.getCarFromWorkstation(id);
  }

  getQualityControl() {
    return this.getCarFromWorkstation(this.getCurrentWorkstationId())
      .qualityControl;
  }

  isUnderMaintenance() {
    return this.getCurrentWorkstation().isUnderMaintenance();
  }

  getRemainingMaintenanceTime() {
    return this.getCurrentWorkstation().getRemainingMaintenanceTime();
  }

  endRound() {
    // Logic to handle end of the round
    console.log("Round over");
    //this.view.updateMessage("Round over. Prepare for the next round.");
    this.view.updateMessage(this.model.getCurrentMessage());
    // Stop the interval in the view
    clearInterval(this.view.timerInterval);
  }

  isGameOver() {
    return this.model.isGameOver();
  }

  getGameStats() {
    return this.model.getGameStats();
  }

  getRoundStats() {
    return this.model.getRoundStats();
  }

  getCapital() {
    return this.model.getCapital();
    //getCapital.amount
  }

  getAmountCarsCompleted() {
    return this.model.getAmountCarsCompleted();
  }

  getPartNames() {
    return this.model.getPartNames();
    //field from currentworkstation!
  }

  isPartAdded(partName) {
    return this.model.isPartAdded(partName);
    //to car of current workstation!
  }

  hasLeanMethod(leanMethod) {
    return this.model.hasLeanMethod(leanMethod);
  }

  isCarComplete() {
    const car = this.getCarFromCurrentWorkstation();
    return this.model.isCarComplete(car.parts);
    //from currentworkstation!
  }

  getWorkstationSize() {
    return this.model.getWorkstationSize();
    //=field in workstation!
  }
}

export { GameController };
