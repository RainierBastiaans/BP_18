import { Game } from "./Models/game.js";
import { gameTemplate } from "./components/game-container.js";

class LeanGame extends HTMLElement {
  constructor() {
    super();
    this.selectedWorkstation =
      JSON.parse(this.getAttribute("options")).selectedWorkstation || 1;
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(gameTemplate.content.cloneNode(true));

    this.messageEl = shadowRoot.getElementById("message");
    this.canvas = shadowRoot.getElementById("bp-game-canvas");
    this.previousButton = shadowRoot.getElementById("previous-station-button");
    this.nextButton = shadowRoot.getElementById("next-station-button");
    this.completedCarsElement = shadowRoot.getElementById(
      "completedCarsElement"
    );
    this.partsAddedElement = shadowRoot.getElementById("partsAddedElement");
    this.moveCarButton = shadowRoot.getElementById("move-car-button");
    this.qualityControlButton = shadowRoot.getElementById("quality-control");
    this.removeButton = shadowRoot.getElementById("remove-button");
    this.qualityControlButton.style.visibility = "hidden";
    this.removeButton.style.visibility = "hidden";
    this.removeButton.disabled = true;

    // Disable buttons based on selected workstation
    this.previousButton.disabled = this.selectedWorkstation === 1;
    this.nextButton.disabled = this.selectedWorkstation === 5;

    this.timeLeft = 180; // Time in seconds
    this.timerInterval = null;
  }

  connectedCallback() {
    this.game = new Game(this.selectedWorkstation);
    this.game.newGame();

    this.currentWorkstationIndex = this.selectedWorkstation;

    this.ctx = this.canvas.getContext("2d");

    this.previousButton.addEventListener("click", this.handleClick.bind(this));
    this.nextButton.addEventListener("click", this.handleClick.bind(this));
    this.moveCarButton.addEventListener("click", this.handleClick.bind(this));
    this.qualityControlButton.addEventListener(
      "click",
      this.handleClick.bind(this)
    );
    this.removeButton.addEventListener("click", this.handleClick.bind(this));

    this.updateMessage();
    this.draw();

    // Add event listener for setInterval
    this.intervalId = setInterval(() => {
      this.draw();
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
      const seconds = workstation.getRemainingTime();
      if (seconds) {
        workstationElement.classList.add("under-maintenance");
        maintenanceTimer.textContent = `Machine Broke, Wait ${seconds}s`; // Combined message
      } else {
        workstationElement.classList.remove("under-maintenance");
        if (maintenanceTimer) {
          maintenanceTimer.textContent = "";
        }
      }
    }
  }

  endRound() {
    clearInterval(this.intervalId);
    this.game.endRound();

    if (this.game.isOver) {
      this.endGame();
      return;
    }
    const gameDetails = {
      gameStats: this.game.stats,
      roundStats: this.game.rounds,
      capital: this.game.capital.amount,
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
    this.game.endRound();

    const gameDetails = {
      gameStats: this.game.stats,
      roundStats: this.game.rounds,
      capital: this.game.capital.amount,
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
    this.game.newRound(leanMethod);
    // Add event listener for setInterval
    this.intervalId = setInterval(() => {
      this.draw();
      this.updateMessage();
      if (this.game.currentRound.isOver) {
        this.endRound();
      }
    }, 500); // Call every 0.5 seconds (500 milliseconds)
  }

  handleClick(event) {
    if (event.target.classList.contains("part-button")) {
      this.handlePartButtonClick(event.target);
    } else if (event.target === this.previousButton) {
      this.goToPreviousWorkstation();
    } else if (event.target === this.nextButton) {
      this.goToNextWorkstation();
    } else if (event.target === this.moveCarButton) {
      this.moveCar();
    } else if (event.target === this.qualityControlButton) {
      this.qualityControl();
    } else if (event.target === this.removeButton) {
      this.removeCar();
    }
  }

  removeCar(){
    this.game.getCarFromWorkstation(this.getCurrentWorkstation().id).remove(this.game.cars);
    this.updateQualityControlButton();
  }

  qualityControl() {
    if (
      this.game
        .getCarFromWorkstation(this.getCurrentWorkstation().id)
        .qualityControl()
    ) {
      this.qualityControlButton.style.backgroundColor = "red";
      this.removeButton.disabled = false;
    } else {
      this.qualityControlButton.style.backgroundColor = "green";
    }
  }

  updateQualityControlButton() {
    this.qualityControlButton.style.removeProperty("background-color");
    this.removeButton.disabled = true;
  }
  moveCar() {
    this.game
      .getCarFromWorkstation(this.getCurrentWorkstation().id)
      .manualMove(this.game.cars, this.game.workstations);
    this.updateMessage();
    this.updateQualityControlButton();
  }

  handlePartButtonClick(button) {
    const partName = button.dataset.partName;
    this.game.addPart(partName, this.getCurrentWorkstation().id);
    this.updateMessage();
    this.updateQualityControlButton();
  }

  updateMessage() {
    // ... (update previous/next button states)
    this.clearButtons();
    this.messageEl.textContent =
      "Work On Workstation " + this.getCurrentWorkstation().id;
    // Update UI elements (assuming you have elements for displaying messages)
    this.completedCarsElement.textContent = `Cars completed: ${this.game.stats.carsCompleted}`;

    if (this.game.getCarFromWorkstation(this.getCurrentWorkstation().id)) {
      this.createButtons();

      // Show added parts/total parts
      const partsAdded = Object.values(
        this.game.getCarFromWorkstation(this.getCurrentWorkstation().id)
          ?.parts || {}
      ).filter((part) => part).length;

      const totalParts = Object.keys(
        this.game.getCarFromWorkstation(this.getCurrentWorkstation().id)
          ?.parts || {}
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
      this.removeButton.style.visibility = "hidden";
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

    this.getCurrentWorkstation().partnames.forEach((part) => {
      this.moveCarButton.style.visibility = "visible";
      const button = document.createElement("button");
      button.classList.add("part-button");
      button.textContent = part;
      button.dataset.partName = part;
      button.addEventListener("click", this.handleClick.bind(this));
      button.disabled = this.game
        .getCarFromWorkstation(this.getCurrentWorkstation().id)
        .isAdded(part); //disable button if already added
      buttonContainer.appendChild(button);
    });

    this.shadowRoot.appendChild(buttonContainer);

    if (this.game.leanMethods.has("qc")) {
      this.qualityControlButton.style.visibility = "visible";
      this.removeButton.style.visibility = "visible";
    }

    // Enable buttons based on workstation completion
    const isComplete = this.getCurrentWorkstation().isComplete(
      this.game.getCarFromWorkstation(this.getCurrentWorkstation().id).parts
    );
    this.moveCarButton.disabled = !isComplete;
    this.qualityControlButton.disabled = !isComplete;
  }

  goToPreviousWorkstation() {
    // Decrement index with modulo to handle wrap-around
    this.currentWorkstationIndex--;

    // Update button states
    this.previousButton.disabled = this.currentWorkstationIndex === 1;
    this.nextButton.disabled = false; // Reset next button

    this.updateMessage();
    this.draw();
  }

  goToNextWorkstation() {
    // Increment index with modulo to handle wrap-around
    this.currentWorkstationIndex++;

    // Update button states
    this.previousButton.disabled = false; // Reset previous button
    this.nextButton.disabled =
      this.currentWorkstationIndex === this.game.workstations.size;

    this.updateMessage();
    this.draw();
  }

  getCurrentWorkstation() {
    return this.game.workstations.get(parseInt(this.currentWorkstationIndex));
  }
}

customElements.define("lean-game", LeanGame);
