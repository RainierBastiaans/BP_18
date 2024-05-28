import { GameFacade } from "./model/gameFacade.js";
//import { UnderMaintenanceWorkstation } from "./model/domain/state/workstation/workstation-under-maintenance.js";
import { gameTemplate } from "./view/gameplay/game-container.js";
import { StartController } from "./controller/startController.js";

class LeanGame extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(gameTemplate.content.cloneNode(true));

    this.messageEl = shadowRoot.getElementById("message");
    this.previousButton = shadowRoot.getElementById("previous-station-button");
    this.nextButton = shadowRoot.getElementById("next-station-button");
    this.completedCarsElement = shadowRoot.getElementById(
      "completedCarsElement"
    );
    this.partsAddedElement = shadowRoot.getElementById("partsAddedElement");
    this.moveCarButton = shadowRoot.getElementById("move-car-button");
    this.qualityControlButton = shadowRoot.getElementById("quality-control");
    this.qualityControlButton.style.visibility = "hidden";
    this.previousButton.disabled = true; // Initially disabled
    this.timeLeft = 180; // Time in seconds
    this.timerInterval = null;
    this.options = JSON.parse(this.getAttribute("options") || "[]"); // Get the options attribute
  }

  connectedCallback() {
    this.GameFacade = new GameFacade();

    //Pass elements as an array to the gameController constructor
    const elements = [
      this.previousButton,
      this.nextButton,
      this.moveCarButton,
      this.qualityControlButton,
    ];

    this.startController = new StartController(this);
    this.startController.startGame();
    this.gameController = new GameController(elements);
    this.roundController = new RoundController(this);

    this.currentWorkstationIndex = 1;

    //this.previousButton.addEventListener("click", this.handleClick.bind(this));
    // this.nextButton.addEventListener("click", this.handleClick.bind(this));
    // this.moveCarButton.addEventListener("click", this.handleClick.bind(this));
    // this.qualityControlButton.addEventListener(
    //   "click",
    //   this.handleClick.bind(this));

    this.updateMessage();
    this.draw();

    // Add event listener for setInterval
    this.intervalId = setInterval(() => {
      this.carVisuals();
      this.updateMessage();
      if (this.game.currentRound.isOver) {
        this.endRound();
      }
    }, 500); // Call every 0.5 seconds (500 milliseconds)
  }

  draw() {
    const workstation = this.getCurrentWorkstation();

    // Update visual representation based on maintenance status
    const workstationElement = this.shadowRoot.getElementById(
      "current-workstation"
    );
    if (workstationElement) {
      const maintenanceTimer =
        workstationElement.querySelector(".maintenance-timer");
      if (this.isUnderMaintenance()) {
        workstationElement.classList.add("under-maintenance");
        const seconds = this.gameController.getRemainingMaintenanceTime();
        maintenanceTimer.textContent = `Machine broken, wait ${seconds}s`; // Combined message
      } else {
        workstationElement.classList.remove("under-maintenance");
        if (maintenanceTimer) {
          maintenanceTimer.textContent = "";
        }
      }
    }
  }

  isUnderMaintenance() {
    return this.gameController.isUnderMaintenance();
  }

  endRound() {
    clearInterval(this.intervalId);
    this.gameController.endRound();

    if (this.gameController.isGameOver()) {
      this.endGame();
      return;
    }
    const gameDetails = {
      gameStats: this.gameController.getGameStats(),
      roundStats: this.roundController.getRoundStats(),
      capital: this.gameController.getCapital(),
    };

    this.dispatchEvent(
      new CustomEvent("roundover", {
        detail: gameDetails,
        bubbles: true,
        composed: true,
      })
    );
  }

  endGame() {
    clearInterval(this.intervalId);
    this.gameController.endRound();

    const gameDetails = {
      gameStats: this.gameController.getGameStats(),
      roundStats: this.gameController.getRoundStats(),
      capital: this.gameController.getCapital(),
    };

    this.dispatchEvent(
      new CustomEvent("gameover", {
        detail: gameDetails,
        bubbles: true,
        composed: true,
      })
    );
  }

  newRound(leanMethod) {
    this.gameController.newRound(leanMethod);
    // Add event listener for setInterval
    this.intervalId = setInterval(() => {
      this.carVisuals();
      this.updateMessage();
      if (this.gameController.isRoundOver()) {
        this.endRound();
      }
    }, 500); // Call every 0.5 seconds (500 milliseconds)
  }

  adjustSettingsForOptions() {
    if (this.options.includes("timeLimit")) {
      this.timeLeft = 20;
    } else {
      this.timeLeft = 2;
    }
  }

  qualityControl() {
    this.qualityControlButton.style.backgroundColor = this.getQualityControl()
      ? "red"
      : "green";
  }

  getQualityControl() {
    return this.gameController.getQualityControl();
  }

  updateQualityControlButton() {
    this.qualityControlButton.style.removeProperty("background-color");
  }

  moveCar() {
    this.gameController.moveCar();
    this.updateMessage();
    this.updateQualityControlButton();
  }

  updateMessage() {
    // ... (update previous/next button states)
    this.clearButtons();

    this.messageEl.textContent =
      "Work on workstation " + this.gameController.getCurrentWorkstationId();
    // Update UI elements (assuming you have elements for displaying messages)
    this.completedCarsElement.textContent = `Cars completed: ${this.gameController.getAmountCarsCompleted()}`;

    if (this.gameController.getCarFromCurrentWorkstation()) {
      this.createButtons();

      // Show added parts/total parts
      const partsAdded = Object.values(
        this.gameController.getCarFromCurrentWorkstation()?.parts || {}
      ).filter((part) => part).length;

      const totalParts = Object.keys(
        this.gameController.getCarFromCurrentWorkstation()?.parts || {}
      ).length;

      const partsMessage = `${partsAdded}/${totalParts} parts added`;

      this.partsAddedElement.textContent = partsMessage;
    } else {
      const noCarContainer = document.createElement("div");
      noCarContainer.classList.add("no-car");
      noCarContainer.textContent = "No Car at the moment";
      this.partsAddedElement.textContent = "";
      this.shadowRoot.appendChild(noCarContainer);
      this.moveCarButton.style.visibility = "hidden";
      this.qualityControlButton.style.visibility = "hidden";
      this.moveCarButton.style.visibility = "hidden";
      this.qualityControlButton.style.visibility = "hidden";
    }
  }

  clearButtons() {
    const buttonContainer = this.shadowRoot.querySelector(".part-buttons");
    const noCarContainer = this.shadowRoot.querySelector(".no-car");

    // Remove elements in a single line using optional chaining
    buttonContainer?.remove();
    noCarContainer?.remove();
  }

  createButtons() {
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("part-buttons");

    const partnames = this.gameController.getPartNames();

    partnames.forEach((part) => {
      this.moveCarButton.style.visibility = "visible";
      const button = document.createElement("button");
      const img = document.createElement("img");
      img.src = `./img/${part}.png`;
      img.alt = `image of ${part}`;
      button.classList.add("part-button");
      button.dataset.partName = part;
      //button.style.background = `url('./img/${part}.png') no-repeat`;
      button.addEventListener("click", this.handleClick.bind(this));
      button.disabled = this.gameController.isPartAdded(part); //disable button if already added
      button.append(img);
      buttonContainer.appendChild(button);
    });

    this.shadowRoot.appendChild(buttonContainer);

    // Show quality control button conditionally
    this.qualityControlButton.style.visibility =
      this.gameController.hasLeanMethod("qc") ? "visible" : "hidden";

    // Enable buttons based on workstation completion
    const isCarComplete = this.gameController.isCarComplete();
    this.moveCarButton.disabled = !isCarComplete;
    this.qualityControlButton.disabled = !isCarComplete; // Optional chaining for safety
  }

  carVisuals() {
    const partnames = this.gameController.getPartNames();
    const car = this.gameController.getCarFromCurrentWorkstation();

    const carContainer = this.shadowRoot.getElementById("car-container");

    try {
      //loop all parts to check if added
      partnames.forEach((part) => {
        const carPart = document.createElement("img");
        const checkImg = this.shadowRoot.getElementById(part);
        if (checkImg == null && this.gameController.isPartAdded(part)) {
          carPart.className = "car-part";
          carPart.id = part;
          carPart.src = `./img/${part}.png`;
          carPart.alt = `image of ${part}`;
          carContainer.append(carPart);
        }
      });
      //Check if car is complete

      if (this.gameController.isCarComplete()) {
        // if car complete wait 1 second and clear carContainer
        setTimeout(() => {
          carContainer.innerHTML = "";
        }, 1000);
      }
    } catch (error) {
      //console.error(error);
    }
  }

  goToPreviousWorkstation() {
    const carContainer = this.shadowRoot.getElementById("car-container");
    carContainer.innerHTML = "";

    // Decrement index with modulo to handle wrap-around
    this.currentWorkstationIndex--;

    // Update button states
    this.previousButton.disabled = this.currentWorkstationIndex === 1;
    this.nextButton.disabled = false; // Reset next button

    this.updateMessage();
    this.draw();
  }

  goToNextWorkstation() {
    const carContainer = this.shadowRoot.getElementById("car-container");
    carContainer.innerHTML = "";
    console.log("To next station");

    // Increment index with modulo to handle wrap-around
    this.currentWorkstationIndex++;

    // Update button states
    this.previousButton.disabled = false; // Reset previous button
    this.nextButton.disabled =
      this.currentWorkstationIndex === this.gameController.getWorkstationSize();

    this.updateMessage();
    this.draw();
  }

  getCurrentWorkstation() {
    return this.gameController.getCurrentWorkstation();
    //return this.game.workstations.get(this.currentWorkstationIndex);
  }
}

customElements.define("lean-game", LeanGame);
