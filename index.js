import { Workstation } from "./Models/Workstation.js";

const gameTemplate = document.createElement("template");
gameTemplate.innerHTML = `
  <p id="message">Work on Workstation 1</p>
  <canvas id="bp-game-canvas" width="300" height="300"></canvas>
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
    this.rounds = 5;
    this.time = 180; // Time in seconds
    this.workstations = [
      new Workstation(1, "Frame"),
      new Workstation(2, "Door"),
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
      this.ctx.fillStyle = station.completed ? "green" : "red";
      this.ctx.fillRect(x, y, width, height);

      // Display part name next to the rectangle
      this.ctx.fillStyle = "black";
      this.ctx.font = "12px Arial";
      const partText = `${station.part}`;
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
    this.messageEl.textContent = `Work on Workstation ${currentStation.id}`;
    this.addButton.textContent = currentStation.completed
      ? "Remove " + currentStation.part
      : "Add " + currentStation.part;
    this.previousButton.disabled = this.currentWorkstationIndex === 0; // Disable prev button at first station
    this.nextButton.disabled =
      this.currentWorkstationIndex === this.workstations.length - 1; // Disable next button if all completed
  }

  addPart() {
    const currentStation = this.workstations[this.currentWorkstationIndex];
    currentStation.completed = !currentStation.completed; 

    // Check if all workstations are done
    if (this.workstations.every((station) => station.completed)) {
      this.messageEl.textContent = "Game Complete!";
      // Stop the game loop (optional)
      return;
    }


    this.updateMessage();
  }

  goToPreviousWorkstation() {
    this.currentWorkstationIndex = (this.currentWorkstationIndex - 1 + this.workstations.length) % this.workstations.length;
    this.updateMessage();
  }
  
  goToNextWorkstation() {
    this.currentWorkstationIndex = (this.currentWorkstationIndex + 1) % this.workstations.length;
    this.updateMessage();
  }

  
}

customElements.define("lean-game", LeanGame);
