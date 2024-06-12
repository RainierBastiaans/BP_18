import { Game } from "../../Models/game.js";
import { CarPositionLine } from "./car-position.js";
import { gameValues } from "../../game-values.js";

class LeanGame extends HTMLElement {
  constructor() {
    super();
    const gameTemplate = document.createElement("template");
    gameTemplate.innerHTML = `
<link rel="stylesheet" href="styles.css">
<div id="game-info" class="component-style">
  <div class="game-timer">
    <svg>
      <circle cx="50%" cy="50%" r="45"/>
      <circle cx="50%" cy="50%" r="45" pathLength="1" />
      <text x="50" y="50" text-anchor="middle"><tspan id="game-timeLeft"></tspan></text>
      <text x="50" y="65" text-anchor="middle">seconds</text>
    </svg>
  </div>

  <div>
    <h2 id="roundMessage">Round</h2>
    <div class="flex-row">
      <button id="previous-station-button" title="Previous Station"></button>
      <p id="message">Workstation</p>
      <button id="next-station-button" title="Next Station"></button>
    </div>
  </div>

  <p id="current-workstation"> </p>
</div>

<div id="visuals-container" class="component-style" >
  <div id="stock-container">
    <p id="stockTitle">Available stock</p>
    <div id="part-buttons"></div>
  </div>

  <div id="car-game-container">
    <p id="workstationTitle">Workstation</p>
    <button id="move-car-button">Move Car to Next Station</button>
    <div id="car-container" class="car-container"></div>
  </div>

  <div id="extra-container">
    <button id="quality-control" class="circle-button" title="Quality Control"></button> 
    <button id="remove-button" class="circle-button" title="Remove Car"></button>

    <div class="timer">
      <svg>
        <circle cx="50%" cy="50%" r="90"/>
        <circle cx="50%" cy="50%" r="90" pathLength="1" />
        <text x="100" y="100" text-anchor="middle"><tspan id="timeLeft"></tspan></text>
        <text x="100" y="120" text-anchor="middle">seconds till fixed</text>
      </svg>
    </div>
  </div>
</div>
  
`;

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(gameTemplate.content.cloneNode(true));

    this.messageEl = shadowRoot.getElementById("message");
    this.roundMessageEl = shadowRoot.getElementById("roundMessage");

    this.previousButton = shadowRoot.getElementById("previous-station-button");
    this.nextButton = shadowRoot.getElementById("next-station-button");
    this.moveCarButton = shadowRoot.getElementById("move-car-button");
    this.qualityControlButton = shadowRoot.getElementById("quality-control");
    this.removeButton = shadowRoot.getElementById("remove-button");
    this.carContainer = shadowRoot.getElementById("car-container");
    this.carGameContainer = shadowRoot.getElementById("car-game-container");
    this.buttonContainer = shadowRoot.getElementById("part-buttons");
    this.workstationTitle = this.shadowRoot.getElementById("workstationTitle");
    this.stockTitle = this.shadowRoot.getElementById("stockTitle");
    this.qualityControlButton.style.display = "none";
    this.removeButton.style.display = "none";
    this.removeButton.disabled = true;
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
    this.shadowRoot.prepend(this.carPositionLine);
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
      if (!workstation) {
        console.log("das nie goe eh");
      }
      const seconds = workstation.getRemainingTime();
      if (seconds) {
        workstationElement.classList.add("under-maintenance");
        this.shadowRoot.querySelector(".timer").classList.remove("hidden");
        this.runMaintenanceTimer(this.shadowRoot.querySelector(".timer"));
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
      leanMethods: this.leanMethodService.getAllLeanMethods(),
    };

    this.dispatchEvent(
      new CustomEvent("roundover", {
        detail: gameDetails,
        bubbles: true,
        composed: true,
      })
    );
  }

  newGame(db, leanMethodService, parts) {
    this.game = new Game(db, leanMethodService, parts);
    this.leanMethodService = leanMethodService;
  }

  startGame(playerName, selectedWorkstation = 1, bots) {
    this.currentWorkstationIndex = selectedWorkstation;
    // Disable buttons based on selected workstation
    this.previousButton.disabled = selectedWorkstation === 1;
    this.nextButton.disabled = selectedWorkstation === 5;
    this.game.startGame(selectedWorkstation, playerName, bots);
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
    if (this.game.getAmountOfPart(partName) >= 4) {
      this.generateNewButton(partName);
    }

    this.updateMessage();
    this.updateQualityControlButton();
  }

  updateMessage() {
    this.draw();

    // Game Timer
    this.runGameTimer(this.shadowRoot.querySelector(".game-timer"));

    // ... (update previous/next button states)
    this.clearButtons();
    this.roundMessageEl.textContent =
      "Round " + this.game.currentRound.roundNumber.toString();
    this.messageEl.textContent =
      "Workstation " + this.getCurrentWorkstation().id;

    if (this.game.getCarFromWorkstation(this.getCurrentWorkstation().id)) {
      this.createButtons();
      this.carVisuals();
    } else {
      const noCarContainer = document.createElement("div");
      noCarContainer.classList.add("no-car");
      noCarContainer.textContent = "No Car at the moment";
      this.carGameContainer.prepend(noCarContainer);
      this.moveCarButton.style.visibility = "hidden";
      this.qualityControlButton.style.display = "none";
      this.removeButton.style.display = "none";
    }
  }

  clearButtons() {
    const noCarContainer = this.shadowRoot.querySelector(".no-car");

    // Remove elements in a single line using optional chaining
    this.stockTitle.classList.add("hidden");
    this.buttonContainer.classList.add("hidden");
    this.buttonContainer.innerHTML = "";
    this.workstationTitle.classList.add("hidden");
    this.carContainer.classList.add("hidden");
    this.carContainer.innerHTML = "";
    noCarContainer?.remove();
  }

  createPartButton(part, index) {
    const button = document.createElement("input");

    button.setAttribute("id", `${part}${index}`);
    button.setAttribute("part", part);
    button.setAttribute("type", "image");
    button.setAttribute("src", `./img/parts/${part}.png`);
    button.setAttribute("alt", `Image of ${part}`);
    button.classList.add("part-button");
    button.dataset.partName = part;

    button.addEventListener("click", this.handleClick.bind(this));

    if (this.getCurrentWorkstation().getRemainingTime()) {
      button.disabled = true;
    } else {
      button.disabled = this.game
        .getCarFromWorkstation(this.getCurrentWorkstation().id)
        .isAdded(part);
    }

    return button;
  }

  getPartCount(part) {
    let amount = Number(this.game.getAmountOfPart(part));
    let count = Math.min(amount, 4);
    if (
      this.leanMethodService.getLeanMethod("just-in-time").isEnabled &&
      count <= 1
    ) {
      count = 1;
    }
    return count;
  }

  createButtons() {
    if (this.game.selectedWorkstation === this.getCurrentWorkstation().id) {
      this.stockTitle.classList.remove("hidden");
      this.buttonContainer.classList.remove("hidden");
      this.moveCarButton.style.visibility = "visible";
      const currentWorkstation = this.getCurrentWorkstation();
      const car = this.game.getCarFromWorkstation(currentWorkstation.id);
      const isComplete = currentWorkstation.isComplete(car.parts);

      this.moveCarButton.disabled = !isComplete;
      this.qualityControlButton.disabled = !isComplete;

      if (
        this.leanMethodService.getLeanMethod("total-quality-control").isEnabled
      ) {
        this.qualityControlButton.style.display = "";
        this.removeButton.style.display = "";
      }

      if (this.leanMethodService.getLeanMethod("orderly-workplace").isEnabled) {
        this.buttonContainer.classList.remove("part-buttons");
        this.buttonContainer.classList.add("part-buttons-oderly");

        this.getCurrentWorkstation().partnames.forEach((part) => {
          const partContainer = document.createElement("div");
          partContainer.classList.add("part-container");

          const count = this.getPartCount(part);
          for (let i = 0; i < count; i++) {
            const button = this.createPartButton(part, i);
            partContainer.appendChild(button);
          }
          const stockCount = document.createElement("p");
          stockCount.id = "stockCount";
          stockCount.innerText = this.leanMethodService.getLeanMethod(
            "just-in-time"
          ).isEnabled
            ? `Enough stock (JIT)`
            : `${part} in stock: ${Number(
                this.game.getAmountOfPart(part)
              ).toString()}`;
          partContainer.appendChild(stockCount);
          this.buttonContainer.appendChild(partContainer);
        });
      } else {
        this.buttonContainer.classList.add("part-buttons");
        for (let i = 0; i < 30; i++) {
          const gritItem = document.createElement("div");
          gritItem.id = i;
          gritItem.classList.add("grid-item");
          this.buttonContainer.append(gritItem);
        }

        if (this.partPosition.length == 0) {
          const gridItems =
            this.buttonContainer.getElementsByClassName("grid-item");
          this.getCurrentWorkstation().partnames.forEach((part) => {
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
          const gridItems =
            this.buttonContainer.getElementsByClassName("grid-item");
          this.partPosition.forEach((position) => {
            let button = position.button;
            if (this.getCurrentWorkstation().getRemainingTime()) {
              button.disabled = true;
            } else {
              button.disabled = this.game
                .getCarFromWorkstation(this.getCurrentWorkstation().id)
                .isAdded(button.getAttribute("part"));
            }
            gridItems[position.index].appendChild(button);
          });
        }
      }
    }
  }

  generateNewButton(part) {
    const gridItems = this.buttonContainer.getElementsByClassName("grid-item");

    let randomIndex;
    let cellIsEmpty = false;

    try {
      while (!cellIsEmpty) {
        randomIndex = Math.floor(Math.random() * gridItems.length);
        if (gridItems[randomIndex].children.length === 0) {
          cellIsEmpty = true;
        }
      }

      const button = this.createPartButton(part, 4);
      this.partPosition.push({
        index: randomIndex,
        button: button,
      });

      gridItems[randomIndex].appendChild(button);
    } catch (error) {}
  }

  // Draws the car parts on the screen
  carVisuals() {
    this.workstationTitle.classList.remove("hidden");
    this.carContainer.classList.remove("hidden");
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
      this.carContainer.append(placeholder);
    }

    const checkw1Holder = this.shadowRoot.getElementById(`w1-holder`);
    if (car && workstation.id == 1 && checkw1Holder == null) {
      const placeholder = document.createElement("img");
      placeholder.id = `w1-holder`;
      placeholder.src = `./img/placeholders/workstation1-placeholder.svg`;
      placeholder.alt = `image of workstation 1 placeholder`;
      this.carContainer.append(placeholder);
    }

    try {
      // Loop all parts and check if added
      workstation.partnames.forEach((part) => {
        const checkImg = this.shadowRoot.getElementById(part);

        if (checkImg == null && car.isAdded(part)) {
          const carPart = document.createElement("img");
          carPart.className = "car-part";
          carPart.id = part;
          carPart.src = `./img/parts/${part}.png`;
          carPart.alt = `image of ${part}`;
          this.carContainer.append(carPart);
        }
      });
    } catch (error) {
      //console.error(error);
    }
    if (workstation.getRemainingTime()) {
      this.carContainer.style.backgroundColor = "#ed4f4f";
    } else {
      this.carContainer.style.backgroundColor = "";
    }
  }

  //** timer code */
  runMaintenanceTimer(timerElement) {
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
      timerElement.classList.remove("animatable");
    }
  }

  /* game timer */
  runGameTimer(timerElement) {
    let timeLeft = this.game.getRemainingTime();
    let duration = gameValues.roundDuration;
    const timerCircle = timerElement.querySelector("svg > circle + circle");
    timerElement.classList.add("animatable");
    timerCircle.style.strokeDashoffset = 1;

    if (timeLeft > -1) {
      const normalizedTime = (duration - timeLeft) / duration;
      timerCircle.style.strokeDashoffset = normalizedTime;
      this.shadowRoot.getElementById("game-timeLeft").innerHTML = timeLeft;
    } else {
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
    // Dispatch custom event 'change-workstation'
    document.dispatchEvent(
      new CustomEvent("change-workstation", {
        detail: {
          currentWorkstationIndex: this.currentWorkstationIndex - 1,
          bubbles: true,
          composed: true,
        },
      })
    );
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
    // Dispatch custom event 'change-workstation'
    document.dispatchEvent(
      new CustomEvent("change-workstation", {
        detail: {
          currentWorkstationIndex: this.currentWorkstationIndex - 1,
          bubbles: true,
          composed: true,
        },
      })
    );
  }

  getCurrentWorkstation() {
    return this.game.workstations.get(parseInt(this.currentWorkstationIndex));
  }
  show() {
    this.classList.remove("hidden");
  }
  hide() {
    this.classList.add("hidden");
  }
}

customElements.define("lean-game", LeanGame);
export { LeanGame };
