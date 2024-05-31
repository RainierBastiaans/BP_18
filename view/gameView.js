import { gameTemplate } from "./gameplay/game-container.js";

class GameView extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(gameTemplate.content.cloneNode(true));

    //Get references DOM elements
    this.gameContainer = document.getElementById("game-container");

    //Initialize elements
    this.initializeElements();

    //Moet in model?
    this.timeLeft = 180; // Time in seconds
    this.timerInterval = null;
  }

  //get the game screen
  show() {
    //Show game container
    this.gameContainer.classList.remove("hidden");
  }

  //hide the game screen
  hide() {
    gameContainer.classList.add("hidden");
  }

  initializeElements() {
    this.messageEl = this.shadowRoot.getElementById("message");

    // Get the buttons
    this.previousButton = this.shadowRoot.getElementById(
      "previous-station-button"
    );
    this.nextButton = this.shadowRoot.getElementById("next-station-button");
    this.moveCarButton = this.shadowRoot.getElementById("move-car-button");
    this.qualityControlButton =
      this.shadowRoot.getElementById("quality-control");

    //Additional elements
    this.completedCarsElement = this.shadowRoot.getElementById(
      "completedCarsElement"
    );
    this.partsAddedElement =
      this.shadowRoot.getElementById("partsAddedElement");

    //initialize style
    this.qualityControlButton.style.visibility = "hidden";
    this.previousButton.disabled = true; // Initially disabled

    // Get part buttons
    this.partButtons = Array.from(
      this.shadowRoot.querySelectorAll(".part-button")
    );
  }

  connectedCallback() {
    this.updateMessage();
    this.draw();
    this.startInterval();
    // Add event listener for setInterval
    // this.intervalId = setInterval(() => {
    //   this.carVisuals();
    //   this.updateMessage();
    //   this.dispatchEvent(new CustomEvent("checkRoundOver"));

    //   //   if (this.game.currentRound.isOver) {
    //   //     this.endRound();
    //   //   }
    // }, 500); // Call every 0.5 seconds (500 milliseconds)
  }

  disconnectedCallback() {
    this.stopInterval();
  }

  draw(maintenanceStatus) {
    // Update visual representation based on maintenance status
    const workstationElement = this.shadowRoot.getElementById(
      "current-workstation"
    );
    if (workstationElement) {
      const maintenanceTimer =
        workstationElement.querySelector(".maintenance-timer");
      if (maintenanceStatus.isUnderMaintenance()) {
        workstationElement.classList.add("under-maintenance");
        maintenanceTimer.textContent = `Machine broken, wait ${maintenanceStatus.seconds}s`; // Combined message
      } else {
        workstationElement.classList.remove("under-maintenance");
        maintenanceTimer.textContent = ""; // Clear message
      }
    }
  }

  startInterval() {
    this.timerInterval = setInterval(() => {
      this.carVisuals();
      this.updateMessage();
      this.dispatchEvent(new CustomEvent("checkRoundOver"));
    }, 500); // Call every 0.5 seconds (500 milliseconds)
  }

  stopInterval() {
    clearInterval(this.timerInterval);
  }

  //BIND ELEMENTS WITH EVENTLISTENERS TO CONTROLLERS
  bindPreviousButtonClick(callback) {
    this.previousButton.addEventListener("click", (event) => {
      callback();
    });
  }

  bindNextButtonClick(callback) {
    this.nextButton.addEventListener("click", (event) => {
      callback();
    });
  }

  bindMoveCarButtonClick(callback) {
    this.moveCarButton.addEventListener("click", (event) => {
      callback();
    });
  }

  bindQualityControlButtonClick(callback) {
    this.qualityControlButton.addEventListener("click", (event) => {
      callback();
    });
  }

  bindPartButtonClick(callback) {
    this.partButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        callback(event.target);
      });
    });
  }

  bindCheckRoundOver(callback) {
    this.addEventListener("checkRoundOver", (event) => {
      callback();
    });
  }

  // Methods for updating the UI
  updateMessage(message) {
    this.messageEl.textContent = message;
  }

  updateCarStatus(carStatus) {
    // Code to update car status
  }

  updateQualityControl(qualityControlStatus) {
    // Code to update quality control status
  }
}

customElements.define("lean-game", GameView);
export default GameView;
