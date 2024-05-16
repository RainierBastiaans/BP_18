import { Car } from "./Models/Car.js";
import { Stock } from "./Models/Stock.js";
import { Workstation } from "./Models/Workstation.js";
import { Round } from "./Models/Round.js";

const gameTemplate = document.createElement("template");
gameTemplate.innerHTML = `
  <p id="message">Work on Workstation 1</p>
  <canvas id="bp-game-canvas" width="500" height="300"></canvas>
  <button id="previous-station-button">Previous Station</button>
  <button id="add-part-button">Add Part</button>
  <button id="next-station-button">Next Station</button>
`;

class LeanGame extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(gameTemplate.content.cloneNode(true));

    this.messageEl = shadowRoot.getElementById("message");
    this.canvas = shadowRoot.getElementById("bp-game-canvas");
    this.addButton = shadowRoot.getElementById("add-part-button");
    this.previousButton = shadowRoot.getElementById("previous-station-button");
    this.nextButton = shadowRoot.getElementById("next-station-button");
    this.previousButton.disabled = true; // Initially disabled
  }

  connectedCallback() {
    this.round = new Round();
    this.round.startTimer();
    this.stock = new Stock();
    this.stock.newRound();
    this.car = new Car();
    this.workstations = [
      new Workstation(1, "frame"),
      new Workstation(2, "interior"),
      new Workstation(3, "door"),
      new Workstation(4, "window"),
      new Workstation(5, "tire"),

      // Add more workstations here as needed
    ];
    this.currentWorkstationIndex = 0;
    this.startTime = null;
    this.ctx = this.canvas.getContext("2d");

    this.addButton.addEventListener("click", this.handleClick.bind(this));
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
      this.ctx.fillStyle = this.car.parts[station.part.name] ? "green" : "red";
      this.ctx.fillRect(x, y, width, height);

      // Display part name next to the rectangle
      this.ctx.fillStyle = "black";
      this.ctx.font = "12px Arial";
      const partText = `${station.part.name}`;
      this.ctx.fillText(partText, x + 5, y + 15); // Adjust positioning as needed
    }
  }

  handleClick(event) {
    if (event.target === this.addButton) {
      this.addPart();
    } else if (event.target === this.previousButton) {
      this.goToPreviousWorkstation();
    } else if (event.target === this.nextButton) {
      this.goToNextWorkstation();
    }
  }

  updateMessage() {
    const currentStation = this.workstations[this.currentWorkstationIndex];
    // Check if the car is complete using Car instance
    if (this.car.isComplete()) {
      this.messageEl.textContent = "Car Complete!";
    } else {
      this.messageEl.textContent = `Work on Workstation ${currentStation.id}`;
    }
    this.addButton.textContent = this.car.parts[currentStation.part.name]
      ? "Remove " + currentStation.part.name
      : "Add " + currentStation.part.name;
    this.previousButton.disabled = this.currentWorkstationIndex === 0; // Disable prev button at first station
    this.nextButton.disabled =
      this.currentWorkstationIndex === this.workstations.length - 1; // Disable next button if all completed
  }

  addPart() {
    const currentStation = this.workstations[this.currentWorkstationIndex];
    if (this.car.parts[currentStation.part.name]) {
      this.stock.usePart(currentStation.part.name);
    } else {
      this.stock.detachPart(currentStation.part.name);
    }

    this.car.parts[currentStation.part.name] =
      !this.car.parts[currentStation.part.name];

    console.log(this.car.parts);

    this.updateMessage();
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
