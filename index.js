import { Car } from "./Models/Car.js";
import { Stock } from "./Models/Stock.js";
import { Workstation } from "./Models/workstation.js";
import { Game } from "./Models/Game.js";
import { Round } from "./Models/Round.js";

const gameTemplate = document.createElement("template");
gameTemplate.innerHTML = `
<p id="message">Work on Workstation</p>
<canvas id="bp-game-canvas" width="500" height="300"></canvas>
<button id="previous-station-button">Previous Station</button>
<button id="next-station-button">Next Station</button>
<p id="completedCarsElement">Cars completed: 0</p>
<p id="partsAddedElement">0/0 parts added</p>

`;

class LeanGame extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(gameTemplate.content.cloneNode(true));

    this.messageEl = shadowRoot.getElementById("message");
    this.canvas = shadowRoot.getElementById("bp-game-canvas");
    this.previousButton = shadowRoot.getElementById("previous-station-button");
    this.nextButton = shadowRoot.getElementById("next-station-button");
    this.completedCarsElement = shadowRoot.getElementById("completedCarsElement");
    this.partsAddedElement = shadowRoot.getElementById("partsAddedElement");
    this.previousButton.disabled = true; // Initially disabled
  }

  connectedCallback() {
    this.game = new Game();
    this.rounds = 5;
    this.time = 180; // Time in seconds
    this.stock = new Stock(this.game.parts);
    this.capital = 500;
    this.round = new Round();
    this.round.startTimer();
    this.stock.newRound();
    this.car = new Car(this.game.parts);

    //Create workstations
    this.workstations = [];
    for (let i = 0; i < this.game.parts.length / 4; i++) {
      const startIndex = i * 4; // Starting index for each workstation (multiples of 4)
      const partList = this.game.parts.slice(startIndex, startIndex + 4); // Slice the first 4 parts
      this.workstations.push(new Workstation(i + 1, partList));
    }

    this.currentWorkstationIndex = 0;
    this.startTime = null;
    this.ctx = this.canvas.getContext("2d");

    this.previousButton.addEventListener("click", this.handleClick.bind(this));
    this.nextButton.addEventListener("click", this.handleClick.bind(this));

    this.updateMessage();
    this.startGameLoop();
  }

  startGameLoop() {
    this.startTime = this.startTime || Date.now();
    this.draw();
    requestAnimationFrame(this.startGameLoop.bind(this));
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw game visuals based on state
    for (let i = 0; i < this.workstations.length; i++) {
      const station = this.workstations[i];
      const x = (i * this.canvas.width) / this.workstations.length;
      const y = 10;
      const width = this.canvas.width / this.workstations.length - 10;
      const height = 20;

      const allPartsAdded = station.parts.every(
        (part) => this.car.parts[part.name]
      );
      this.ctx.fillStyle = allPartsAdded ? "green" : "red";
      this.ctx.fillRect(x, y, width, height);
    }
  }

  handleClick(event) {
    if (event.target.classList.contains("part-button")) {
      this.handlePartButtonClick(event.target);
    } else if (event.target === this.previousButton) {
      this.goToPreviousWorkstation();
    } else if (event.target === this.nextButton) {
      this.goToNextWorkstation();
    }
  }

  handlePartButtonClick(button) {
    const partName = button.dataset.partName;
    const currentStation = this.workstations[this.currentWorkstationIndex];

    try {
      // Check if enough parts are in stock before adding
      if (!this.stock.hasEnoughParts(partName)) {
        throw new Error(`Not enough ${partName} in stock!`);
      }

      // Add the part to the car and update stock
      this.car.addPart(partName);
      this.stock.usePart(partName);

      if(this.car.isComplete()){
        this.game.completedCars +=1;
        this.car = new Car(this.game.parts)
      }
    } catch (error) {
      console.error(error.message); // Handle stock-related errors gracefully (e.g., display message to user)
    }
    this.updateMessage();
  }

  updateMessage() {
    const currentStation = this.workstations[this.currentWorkstationIndex];
    // ... (check for car completion)

    // ... (update previous/next button states)

    this.clearPartButtons();
    this.createPartButtons();

    // Update parts added/total parts display
    const partsAdded = Object.values(this.car.parts).filter(
      (part) => part
    ).length;
    const totalParts = Object.keys(this.car.parts).length;
    const partsMessage = `${partsAdded}/${totalParts} parts added`;

    // Update UI elements (assuming you have elements for displaying messages)
    this.completedCarsElement.textContent = `Cars completed: ${this.game.completedCars}`;
    this.partsAddedElement.textContent = partsMessage;
  }

  clearPartButtons() {
    // Remove existing part buttons (if any)
    const buttonContainer = this.shadowRoot.querySelector(".part-buttons");
    if (buttonContainer) {
      buttonContainer.remove();
    }
  }

  createPartButtons() {
    const currentStation = this.workstations[this.currentWorkstationIndex];
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("part-buttons");

    currentStation.parts.forEach((part) => {
      const button = document.createElement("button");
      button.classList.add("part-button");
      button.textContent = part.name;
      button.dataset.partName = part.name;
      button.addEventListener("click", this.handleClick.bind(this));
      buttonContainer.appendChild(button);
    });

    this.shadowRoot.appendChild(buttonContainer);
  }

  goToPreviousWorkstation() {
    this.currentWorkstationIndex =
      (this.currentWorkstationIndex - 1 + this.workstations.length) %
      this.workstations.length;
    this.updateMessage();
  }

  goToNextWorkstation() {
    this.currentWorkstationIndex =
      (this.currentWorkstationIndex + 1) % this.workstations.length;
    this.updateMessage();
  }
}

customElements.define("lean-game", LeanGame);
