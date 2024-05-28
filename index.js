import { Game } from "./Models/game.js";
import { gameTemplate } from "./components/game-container.js";

class LeanGame extends HTMLElement {
  constructor() {
    super();
    this.selectedWorkstation =
      JSON.parse(this.getAttribute("options")).selectedWorkstation || 1;
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

    this.currentWorkstationIndex = 1;
    this.currentWorkstationIndex = this.selectedWorkstation;

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
      const seconds = workstation.getRemainingTime();
      if (seconds) {
        workstationElement.classList.add("under-maintenance");
        this.shadowRoot.querySelector(".timer").classList.remove("hidden");
        this.runTimer(this.shadowRoot.querySelector(".timer"));
      } else {
        workstationElement.classList.remove("under-maintenance");
        this.shadowRoot.querySelector(".timer").classList.add("hidden");
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
      console.log(leanMethod)
    this.game.newRound(leanMethod);
    // Add event listener for setInterval
    this.intervalId = setInterval(() => {
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

  removeCar() {
    this.game
      .getCarFromWorkstation(this.getCurrentWorkstation().id)
      .remove(this.game.cars);
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
    this.draw();
    this.draw();
    // ... (update previous/next button states)
    this.clearButtons();
    this.messageEl.textContent =
      "Work On Workstation " + this.getCurrentWorkstation().id;
    // Update UI elements (assuming you have elements for displaying messages)
    this.completedCarsElement.textContent = `Cars completed: ${this.game.stats.carsCompleted}`;

    if (this.game.getCarFromWorkstation(this.getCurrentWorkstation().id)) {
      this.createButtons();
      this.carVisuals();

    } else {
      const noCarContainer = document.createElement("div");
      noCarContainer.classList.add("no-car");
      noCarContainer.textContent = "No Car at the moment";
      this.shadowRoot.appendChild(noCarContainer);
      this.moveCarButton.style.visibility = "hidden";
      this.qualityControlButton.style.visibility = "hidden";
      this.removeButton.style.visibility = "hidden";
    }
  }

  clearButtons() {
    const buttonContainer = this.shadowRoot.querySelector(".part-buttons");
    const noCarContainer = this.shadowRoot.querySelector(".no-car");
    const carContainer = this.shadowRoot.querySelector(".car-container");

    // Remove elements in a single line using optional chaining
    buttonContainer?.remove();
    noCarContainer?.remove();
    carContainer?.remove();
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

    console.log(this.game.leanMethods)

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

  // Draws the car parts on the screen
  carVisuals() {
    const carContainer = document.createElement("div");
    carContainer.classList.add("car-container");
    carContainer.id = "car-container";
    const workstation = this.getCurrentWorkstation();
    const car = this.game.getCarFromWorkstation(workstation.id);

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
      this.shadowRoot.appendChild(carContainer);
    } catch (error) {
      //console.error(error);
    }
  }

  //** timer code */
  runTimer(timerElement) {
    let timeLeft = this.getCurrentWorkstation().getRemainingTime();
    let duration = this.getCurrentWorkstation().maintenanceDuration / 1000;
    const timerCircle = timerElement.querySelector("svg > circle + circle");
    timerElement.classList.add("animatable");
    timerCircle.style.strokeDashoffset = 1;

    if (timeLeft > -1) {
      const normalizedTime = (duration - timeLeft) / duration;
      timerCircle.style.strokeDashoffset = normalizedTime;
      this.shadowRoot.getElementById("timeLeft").innerHTML = timeLeft;
    } else {
      clearInterval(countdownTimer);
      timerElement.classList.remove("animatable");
    }
  }

  // Draws the car parts on the screen
  carVisuals() {
    const carContainer = document.createElement("div");
    carContainer.classList.add("car-container");
    carContainer.id = "car-container";
    const workstation = this.getCurrentWorkstation();
    const car = this.game.getCarFromWorkstation(workstation.id);

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
      this.shadowRoot.appendChild(carContainer);
    } catch (error) {
      //console.error(error);
    }
  }

  //** timer code */
  runTimer(timerElement) {
    let timeLeft = this.getCurrentWorkstation().getRemainingTime();
    let duration = this.getCurrentWorkstation().maintenanceDuration / 1000;
    const timerCircle = timerElement.querySelector("svg > circle + circle");
    timerElement.classList.add("animatable");
    timerCircle.style.strokeDashoffset = 1;

    if (timeLeft > -1) {
      const normalizedTime = (duration - timeLeft) / duration;
      timerCircle.style.strokeDashoffset = normalizedTime;
      this.shadowRoot.getElementById("timeLeft").innerHTML = timeLeft;
    } else {
      clearInterval(countdownTimer);
      timerElement.classList.remove("animatable");
    }
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
