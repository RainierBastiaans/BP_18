import GameView from "../view/gameView.js";

class GameController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    //Bind the eventlisteners of the view to the controller

    //Moet in model?
    this.timeLeft = 180; // Time in seconds
    this.timerInterval = null;
  }

  show(options) {
    this.view.show(options);
  }

  hide() {
    this.view.hide();
  }

  init(options) {
    this.view = new GameView();

    this.show(options);
    this.bindEventListeners();
    this.updateView();
    this.model.configureGame();
    this.connectedCallback();
    this.updateButtonsState();
  }

  bindEventListeners() {
    this.view.bindPreviousButtonClick(this.handlePreviousButton);
    this.view.bindNextButtonClick(this.handleNextButton);
    this.view.bindMoveCarButtonClick(this.handleMoveCarButton);
    this.view.bindQualityControlButtonClick(this.handleQualityControlButton);
    this.view.bindCheckRoundOver(this.checkRoundOver);
    //bind part button hier?
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

  handlePartButtonClick = (button) => {
    const partName = button.dataset.partName;
    const workstationId = this.getCurrentWorkstationIndex();
    this.model.addPart(partName, workstationId);
    this.updatePartsAdded(this.model.getPartsAdded());
  };

  connectedCallback() {
    this.view.draw(this.model.getCurrentWorkstation());
    this.startInterval();
    // Add event listener for setInterval
    this.intervalId = setInterval(() => {
      this.carVisuals();
      this.updateView();
      this.dispatchEvent(new CustomEvent("checkRoundOver"));

      //   if (this.game.currentRound.isOver) {
      //     this.endRound();
      //   }
    }, 500); // Call every 0.5 seconds (500 milliseconds)
  }

  disconnectedCallback() {
    this.stopInterval();
  }

  startInterval() {
    this.timerInterval = setInterval(() => {
      this.carVisuals();
      this.updateView();
      this.dispatchEvent(new CustomEvent("checkRoundOver"));
    }, 500); // Call every 0.5 seconds (500 milliseconds)
  }

  stopInterval() {
    this.view.clearInterval(this.timerInterval);
  }

  updateView() {
    this.view.updateMessage(this.getCurrentWorkstationIndex());
    this.view.draw(this.model.getCurrentWorkstation());
    this.updateButtonsState();

    this.view.updateCompletedCars(this.getAmountCarsCompleted);

    if (this.getCarFromCurrentWorkstation()) {
      const partnames = this.model.getPartNames();
      this.view.createButtonElements();

      //Create individual part buttons
      partnames.forEach((part) => {
        this.view.bindPartButtonClick(this);
        console.log(part);
        console.log(this);
        this.view.createPartButton(
          part,
          this.isPartAdded(part),
          this.handlePartButtonClick
        );
        //disable button if already added
        //and bind button to event
      });

      this.view.enableButtons(this.isCarComplete());

      // Show added parts/total parts
      const partsAdded = Object.values(
        this.getCarFromCurrentWorkstation()?.parts || {}
      ).filter((part) => part).length;

      const totalParts = Object.keys(
        this.getCarFromCurrentWorkstation()?.parts || {}
      ).length;

      const partsMessage = `${partsAdded}/${totalParts} parts added`;

      this.view.updatePartsAdded(partsMessage);
    } else {
      const textContent = "No Car at the moment";
      this.view.createNoCarElement(textContent);
    }
  }

  updateButtonsState() {
    const currentIndex = this.model.getCurrentWorkstationIndex();
    const totalWorkstations = this.model.getTotalWorkstations();

    this.view.previousButton.disabled = currentIndex === 0;
    this.view.nextButton.disabled = currentIndex === totalWorkstations - 1;

    // const isQualityControlVisible = this.model.shouldShowQualityControl();
    // this.view.qualityControlButton.style.visibility = isQualityControlVisible
    //   ? "visible"
    //   : "hidden";
  }

  carVisuals() {
    // Logic to handle car visuals
    const partnames = this.model.getPartNames();

    partnames.forEach((part) => {
      this.view.carVisual(part, this.isPartAdded(part), this.isCarComplete());
    });
  }

  moveCar() {
    this.model.moveCarToNextStation();
    this.updateView();
    //this.updateQualityControlButton();
  }

  qualityControl() {
    // Logic to handle quality control
  }

  getCurrentWorkstation() {
    return this.model.getCurrentWorkstation();
  }

  getCurrentWorkstationIndex() {
    return this.model.getCurrentWorkstationIndex();
  }

  getCarFromWorkstation(id) {
    return this.model.getCarFromWorkstation(id);
  }

  getCarFromCurrentWorkstation() {
    const id = this.getCurrentWorkstationIndex();
    return this.getCarFromWorkstation(id);
  }

  // getQualityControl() {
  //   return this.getCarFromWorkstation(this.getCurrentWorkstationIndex())
  //     .qualityControl;
  // }

  // isUnderMaintenance() {
  //   return this.getCurrentWorkstation().isUnderMaintenance();
  // }

  // getRemainingMaintenanceTime() {
  //   return this.getCurrentWorkstation().getRemainingMaintenanceTime();
  // }

  endRound() {
    // Logic to handle end of the round
    console.log("Round over");
    // Stop the interval in the view
    this.view.stopInterval();
    const gameDetails = this.model.getGameDetails();

    this.model.endRound();
    this.view.dispatchEvent(
      new CustomEvent("roundover", {
        detail: gameDetails,
        bubbles: true,
        composed: true,
      })
    );
    console.log("Round over. Prepare for the next round.");
  }

  endGame() {
    console.log("Game over");

    this.view.stopInterval();
    const gameDetails = this.model.getGameDetails();
    this.model.endGame();
    this.view.dispatchEvent(
      new CustomEvent("gameover", {
        detail: gameDetails,
        bubbles: true,
        composed: true,
      })
    );
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
    const car = this.getCarFromCurrentWorkstation();
    return car.isAdded(partName);
    return this.model.isPartAdded(partName);
    //to car of current workstation!
  }

  hasLeanMethod(leanMethod) {
    return this.model.hasLeanMethod(leanMethod);
  }

  isCarComplete() {
    const car = this.getCarFromCurrentWorkstation();
    return this.model.isCarComplete(car);
    //from currentworkstation!
  }

  getWorkstationSize() {
    return this.model.getWorkstationSize();
    //=field in workstation!
  }
}

export { GameController };
