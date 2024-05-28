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
    this.previousButton = shadowRoot.getElementById("previous-station-button");
    this.nextButton = shadowRoot.getElementById("next-station-button");
    this.completedCarsElement = shadowRoot.getElementById(
      "completedCarsElement"
    );
    this.partsAddedElement = shadowRoot.getElementById("partsAddedElement");
    this.moveCarButton = shadowRoot.getElementById("move-car-button");
    this.qualityControlButton = shadowRoot.getElementById("quality-control");
    this.qualityControlButton.style.visibility = "hidden";

    // Disable buttons based on selected workstation
    this.previousButton.disabled = this.selectedWorkstation === 1;
    this.nextButton.disabled = this.selectedWorkstation === 5;

    this.timeLeft = 180; // Time in seconds
    this.timerInterval = null;
  }

  connectedCallback() {
    this.game = new Game(this.selectedWorkstation);
    this.game.newGame();

    this.currentWorkstationIndex = 1;
    this.currentWorkstationIndex = this.selectedWorkstation;

    this.previousButton.addEventListener("click", this.handleClick.bind(this));
    this.nextButton.addEventListener("click", this.handleClick.bind(this));
    this.moveCarButton.addEventListener("click", this.handleClick.bind(this));
    this.qualityControlButton.addEventListener(
      "click",
      this.handleClick.bind(this)
    );

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
      this.carVisuals();
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
    }
  }

  qualityControl() {
    this.qualityControlButton.style.backgroundColor = this.game
      .getCarFromWorkstation(this.getCurrentWorkstation().id)
      .qualityControl()
      ? "red"
      : "green";
  }

  updateQualityControlButton() {
    this.qualityControlButton.style.removeProperty("background-color");
  }
  moveCar() {
    this.game
      .getCarFromWorkstation(this.getCurrentWorkstation().id)
      .move(this.game.cars);
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
      const img = document.createElement("img");
      img.src = `./img/${part}.png`;
      img.alt = `image of ${part}`;
      button.classList.add("part-button");
      button.dataset.partName = part;
      //button.style.background = `url('./img/${part}.png') no-repeat`;
      button.addEventListener("click", this.handleClick.bind(this));
      button.disabled = this.game
        .getCarFromWorkstation(this.getCurrentWorkstation().id)
        .isAdded(part); //disable button if already added
      button.append(img);
      buttonContainer.appendChild(button);
    });

    this.shadowRoot.appendChild(buttonContainer);

    // Show quality control button conditionally
    this.qualityControlButton.style.visibility = this.game.leanMethods.has("qc")
      ? "visible"
      : "hidden";

    // Enable buttons based on workstation completion
    const isComplete = this.getCurrentWorkstation().isComplete(
      this.game.getCarFromWorkstation(this.getCurrentWorkstation().id).parts
    );
    this.moveCarButton.disabled = !isComplete;
    this.qualityControlButton.disabled = !isComplete; // Optional chaining for safety
  }

  // Draws the car parts on the screen
  carVisuals() {
    const workstation = this.getCurrentWorkstation();
    const car = this.game.getCarFromWorkstation(workstation.id);
    const carContainer = this.shadowRoot.getElementById("car-container");

    try {
      // Loop all parts and check if added
      workstation.partnames.forEach((part) => {
        const checkImg = this.shadowRoot.getElementById(part);

        if (checkImg == null && car.isAdded(part)) {
          const carPart = document.createElement("img");
          carPart.className = "car-part";
          carPart.id = part;
          carPart.src = `./img/${part}.png`;
          carPart.alt = `image of ${part}`;
          carContainer.append(carPart);
        }
      });

      // Check if car is complete
      if (workstation.isComplete(car.parts)) {
        // If car completed wait 1 second and clear carContainer
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
      this.currentWorkstationIndex === this.game.workstations.size;

    this.updateMessage();
    this.draw();
  }

  getCurrentWorkstation() {
    return this.game.workstations.get(parseInt(this.currentWorkstationIndex));
  }
}

customElements.define("lean-game", LeanGame);
