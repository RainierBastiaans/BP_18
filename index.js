import { Game } from "./Models/game.js";
import { CarPositionLine } from "./components/car-position.js";
import { gameTemplate } from "./components/game-container.js";

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
    this.moveCarButton = shadowRoot.getElementById("move-car-button");
    this.qualityControlButton = shadowRoot.getElementById("quality-control");
    this.removeButton = shadowRoot.getElementById("remove-button");
    this.qualityControlButton.style.visibility = "hidden";
    this.removeButton.style.visibility = "hidden";
    this.removeButton.disabled = true;

    this.timerInterval = null;
    this.partPosition = [];
  }

  connectedCallback() {
    this.previousButton.addEventListener("click", this.handleClick.bind(this));
    this.nextButton.addEventListener("click", this.handleClick.bind(this));
    this.moveCarButton.addEventListener("click", this.handleClick.bind(this));
    this.qualityControlButton.addEventListener(
      "click",
      this.handleClick.bind(this)
    );
    this.removeButton.addEventListener("click", this.handleClick.bind(this));
    this.carPositionLine = new CarPositionLine();
    this.shadowRoot.appendChild(this.carPositionLine);
  }

  draw() {
    this.carPositionLine.setCarPositions(this.game.cars);
    this.carPositionLine.setCurrentWorkstation(this.game.workstations);
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
    if (this.game.isOver) {
      this.endGame();
      return;
    }
    const gameDetails = {
      gameStats: this.game.stats,
      leanMethods: this.game.leanMethods,
    };

    this.dispatchEvent(
      new CustomEvent("roundover", {
        detail: gameDetails,
        bubbles: true,
        composed: true,
      })
    );
  }

  newGame(selectedWorkstation = 1) {
    this.game = new Game(selectedWorkstation);
    this.currentWorkstationIndex = selectedWorkstation;
    // Disable buttons based on selected workstation
    this.previousButton.disabled = selectedWorkstation === 1;
    this.nextButton.disabled = selectedWorkstation === 5;
    this.newRound();
  }

  endGame() {
    clearInterval(this.intervalId);
    const gameDetails = {
      gameStats: this.game.stats,
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
    this.game.currentRound.emitter.on("roundoverInModel", () => {
      this.endRound();
    });
    this.game.currentRound.emitter.on("gameOverInModel", () => {
      this.endGame();
    });
    // Add event listener for setInterval
    this.intervalId = setInterval(() => {
      this.updateMessage();
    }, 500); // Call every 0.5 seconds (500 milliseconds)
    this.partPosition = [];
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
        .getQualityControlValue()
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
    this.partPosition = [];
    this.updateMessage();
    this.updateQualityControlButton();
  }

  handlePartButtonClick(button) {
    const partName = button.dataset.partName;
    //console.log(partName);
    this.game.addPart(partName, this.getCurrentWorkstation().id);

    this.partPosition = this.partPosition.filter(function (obj) {
      return obj.button !== button;
    });

    button.remove();

    this.updateMessage();
    this.updateQualityControlButton();
  }

  updateMessage() {
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
    const buttonContainer = this.shadowRoot.querySelector("#part-buttons");
    const noCarContainer = this.shadowRoot.querySelector(".no-car");
    const carContainer = this.shadowRoot.querySelector(".car-container");

    // Remove elements in a single line using optional chaining
    buttonContainer?.remove();
    noCarContainer?.remove();
    carContainer?.remove();
  }

  createPartButton(part, index) {
    const button = document.createElement("input");

    button.setAttribute("id", `${part}${index}`);
    button.setAttribute("part", part);
    button.setAttribute("type", "image");
    button.setAttribute("src", `./img/${part}.png`);
    button.setAttribute("alt", `Image of ${part}`);
    button.classList.add("part-button");
    button.dataset.partName = part;

    button.addEventListener("click", this.handleClick.bind(this));
    button.disabled = this.game
      .getCarFromWorkstation(this.getCurrentWorkstation().id)
      .isAdded(part);

    return button;
  }

  getPartCount(part) {
    let amount = Number(this.game.getAmountOfPart(part));
    let count = Math.min(amount, 4);
    if (this.game.leanMethods.has("just_in_time") && count <= 1) {
      count = 1;
    }
    return count;
  }

  createButtons() {
    if (this.game.selectedWorkstation === this.getCurrentWorkstation().id) {
      const currentWorkstation = this.getCurrentWorkstation();
      const car = this.game.getCarFromWorkstation(currentWorkstation.id);
      const isComplete = currentWorkstation.isComplete(car.parts);

      this.moveCarButton.disabled = !isComplete;
      this.qualityControlButton.disabled = !isComplete;

      if (this.game.leanMethods.has("total_quality_control")) {
        this.qualityControlButton.style.visibility = "visible";
        this.removeButton.style.visibility = "visible";
      }

      const buttonContainer = document.createElement("div");
      buttonContainer.id = "part-buttons";

      if (this.game.leanMethods.has("orderly_workplace")) {
        buttonContainer.classList.add("part-buttons-oderly");

        this.getCurrentWorkstation().partnames.forEach((part) => {
          this.moveCarButton.style.visibility = "visible";
          const partContainer = document.createElement("div");
          partContainer.classList.add("part-container");

          const count = this.getPartCount(part);
          for (let i = 0; i < count; i++) {
            const button = this.createPartButton(part, i);
            partContainer.appendChild(button);
          }
          buttonContainer.appendChild(partContainer);
        });
      } else {
        buttonContainer.classList.add("part-buttons");
        for (let i = 0; i < 30; i++) {
          const gritItem = document.createElement("div");
          gritItem.id = i;
          gritItem.classList.add("grid-item");
          buttonContainer.append(gritItem);
        }

        if (this.partPosition.length == 0) {
          const gridItems = buttonContainer.getElementsByClassName("grid-item");

          this.getCurrentWorkstation().partnames.forEach((part) => {
            this.moveCarButton.style.visibility = "visible";

            const count = this.getPartCount(part);
            for (let i = 0; i < count; i++) {
              const button = this.createPartButton(part, i);

              let randomIndex;
              let cellIsEmpty = false;

              // Loop until an empty cell is found
              while (!cellIsEmpty) {
                randomIndex = Math.floor(Math.random() * gridItems.length);
                if (gridItems[randomIndex].children.length === 0) {
                  cellIsEmpty = true;
                }
              }

              this.partPosition.push({
                index: randomIndex,
                button: button,
              });
              // Add the new element to the randomly selected empty grid item
              gridItems[randomIndex].appendChild(button);
            }
          });
        } else {
          const gridItems = buttonContainer.getElementsByClassName("grid-item");

          this.partPosition.forEach((position) => {
            let button = position.button;
            button.disabled = this.game
              .getCarFromWorkstation(this.getCurrentWorkstation().id)
              .isAdded(button.getAttribute("part"));
            gridItems[position.index].appendChild(button);
          });
        }
      }

      //end
      this.shadowRoot.appendChild(buttonContainer);
    }
  }

  // Draws the car parts on the screen
  carVisuals() {
    const carContainer = document.createElement("div");
    carContainer.classList.add("car-container");
    carContainer.id = "car-container";
    const workstation = this.getCurrentWorkstation();
    const car = this.game.getCarFromWorkstation(workstation.id);

    const checkHolder = this.shadowRoot.getElementById(
      `placeholder${workstation.id}`
    );
    if (car && workstation.id != 1 && checkHolder == null) {
      const placeholder = document.createElement("img");
      placeholder.id = `placeholder${workstation.id}`;
      placeholder.src = `./img/placeholders/${workstation.id}.png`;
      placeholder.alt = `image of ${workstation.id}`;
      carContainer.append(placeholder);
    }

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
