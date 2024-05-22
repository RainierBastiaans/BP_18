import { Game } from "./Models/Game.js";
import { Bot } from "./Models/bot.js";

const gameTemplate = document.createElement("template");
gameTemplate.innerHTML = `
<link rel="stylesheet" href="styles.css">
<h1>Round <span>1</span></h1>
<p id="message">Work On Workstation</p>
<canvas id="bp-game-canvas" width="500" height="300"></canvas>
<p></p>
<div id="car-container"></div>
<button id="previous-station-button">Previous Station</button>
<button id="next-station-button">Next Station</button>
<p id="completedCarsElement">Cars completed: 0</p>
<p id="partsAddedElement">0/0 parts added</p>
<button id="move-car-button">Move Car to Next Station</button>
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
    this.completedCarsElement = shadowRoot.getElementById(
      "completedCarsElement"
    );
    this.partsAddedElement = shadowRoot.getElementById("partsAddedElement");
    this.moveCarButton = shadowRoot.getElementById("move-car-button");
    this.previousButton.disabled = true; // Initially disabled
    this.timeLeft = 180; // Time in seconds
    this.timerInterval = null;
    this.options = JSON.parse(this.getAttribute("options") || "[]"); // Get the options attribute
  }

  connectedCallback() {
    this.game = new Game();
    this.game.newCar();
    this.game.stock.newRound();

    this.bot1 = new Bot("bot1", 1, this.game);
    this.bot2 = new Bot("bot2", 2, this.game);
    this.bot3 = new Bot("bot3", 3, this.game);
    this.bot4 = new Bot("bot4", 4, this.game);
    this.bot5 = new Bot("bot5", 5, this.game);

    this.currentWorkstationIndex = 1;

    this.startTime = null;
    this.ctx = this.canvas.getContext("2d");

    this.previousButton.addEventListener("click", this.handleClick.bind(this));
    this.nextButton.addEventListener("click", this.handleClick.bind(this));
    this.moveCarButton.addEventListener("click", this.handleClick.bind(this));

    this.adjustSettingsForOptions();
    this.updateMessage();
    // this.startGameLoop();
    //this.bot1.startWorking();
    this.bot2.startWorking();
    this.bot3.startWorking();
    this.bot4.startWorking();
    this.bot5.startWorking();

    // Add event listener for setInterval
    this.intervalId = setInterval(() => {
      this.draw();
      this.updateMessage();
    }, 500); // Call every 0.5 seconds (500 milliseconds)
    this.startTimer();
  }

  adjustSettingsForOptions() {
    if (this.options.includes("timeLimit")) {
      this.timeLeft = 2;
    } else {
      this.timeLeft = 100;
    }
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      this.timeLeft--;

      if (this.timeLeft <= 0) {
        this.endGame();
      }
    }, 1000);
  }

  endGame() {
    clearInterval(this.timerInterval);
    alert("Game Over!");
    this.dispatchEvent(
      new CustomEvent("gameover", {
        detail: {
          score: this.game.completedCars,
          stock: 20, //JSON.stringify(this.stock.parts), //TODO zoek een goede manier om overige stock te tonen
          capital: this.game.capital,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  // startGameLoop() {
  //   this.startTime = this.startTime || Date.now();
  //   this.draw(this.game.workstations[this.currentWorkstationIndex]);
  //   requestAnimationFrame(this.startGameLoop.bind(this));
  // }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.game.getCarFromWorkstation(this.getCurrentWorkstation().id)) {
      // Draw game visuals based on state
      for (let i = 0; i < this.game.workstations.length; i++) {
        const station = this.game.workstations[i];
        const x = (i * this.canvas.width) / this.game.workstations.length;
        const y = 10;
        const width = this.canvas.width / this.game.workstations.length - 10;
        const height = 20;

        const allPartsAdded = station.parts.every(
          (part) =>
            this.game.getCarFromWorkstation(this.getCurrentWorkstation().id)
              .parts[part.name]
        );
        this.ctx.fillStyle = allPartsAdded ? "green" : "red";
        this.ctx.fillRect(x, y, width, height);
      }
    }
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
    }
  }

  moveCar() {
    this.game
      .getCarFromWorkstation(this.getCurrentWorkstation().id)
      .moveCar(this.game.cars);
    this.game.moveWaitingcars();
    //
    const carContainer = this.shadowRoot.getElementById("car-container");
    carContainer.innerHTML = "";
    //
    this.updateMessage();
  }

  handlePartButtonClick(button) {
    const partName = button.dataset.partName;
    this.game.addPart(partName, this.getCurrentWorkstation().id);
    //
    const carPart = document.createElement("img");
    const carContainer = this.shadowRoot.getElementById("car-container");
    carPart.className = "car-part";
    carPart.src = `./img/${partName}.png`;
    carPart.alt = `image of ${partName}`;
    carContainer.appendChild(carPart);
    //
    this.updateMessage();
  }

  updateMessage() {
    // ... (update previous/next button states)
    this.clearPartButtons();

    this.messageEl.textContent =
      "Work On Workstation " + this.getCurrentWorkstation().id;
    // Update UI elements (assuming you have elements for displaying messages)
    this.completedCarsElement.textContent = `Cars completed: ${this.game.completedCars}`;

    if (this.game.getCarFromWorkstation(this.getCurrentWorkstation().id)) {
      this.createPartButtons();

      // Update parts added/total parts display
      const partsAdded = Object.values(
        this.game.getCarFromWorkstation(this.getCurrentWorkstation().id).parts
      ).filter((part) => part).length;
      const totalParts = Object.keys(
        this.game.getCarFromWorkstation(this.getCurrentWorkstation().id).parts
      ).length;
      const partsMessage = `${partsAdded}/${totalParts} parts added`;
      this.partsAddedElement.textContent = partsMessage;
    } else {
      const noCarContainer = document.createElement("div");
      noCarContainer.classList.add("no-car");
      noCarContainer.textContent = "No Car at the moment";
      this.shadowRoot.appendChild(noCarContainer);
    }
  }

  clearPartButtons() {
    const buttonContainer = this.shadowRoot.querySelector(".part-buttons");
    const noCarContainer = this.shadowRoot.querySelector(".no-car");

    // Remove elements in a single line using optional chaining
    buttonContainer?.remove();
    noCarContainer?.remove();
  }

  createPartButtons() {
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("part-buttons");

    this.getCurrentWorkstation().parts.forEach((part) => {
      const button = document.createElement("button");
      const img = document.createElement("img");
      img.src = `./img/${part.name}.png`;
      img.alt = `image of ${part.name}`;
      button.classList.add("part-button");
      button.append(img);
      //button.draggable = true; //drag
      //button.id = part.name; //drag
      //button.addEventListener("dragstart", this.dragStart); //drag

      button.dataset.partName = part.name;
      button.addEventListener("click", this.handleClick.bind(this));
      button.disabled = this.game
        .getCarFromWorkstation(this.getCurrentWorkstation().id)
        .isAdded(part); //disable button if already added
      buttonContainer.appendChild(button);
    });
    /* Drag stuff not working
    const boxes = this.shadowRoot.querySelectorAll(".box");

    boxes.forEach((box) => {
      box.addEventListener("dragenter", this.dragEnter);
      box.addEventListener("dragover", this.dragOver);
      box.addEventListener("dragleave", this.dragLeave);
      box.addEventListener("drop", this.drop);
    });
*/

    this.shadowRoot.appendChild(buttonContainer);
    if (
      this.getCurrentWorkstation().isComplete(
        this.game.getCarFromWorkstation(this.getCurrentWorkstation().id).parts
      )
    ) {
      this.moveCarButton.disabled = false;
    } else {
      this.moveCarButton.disabled = true;
    }
  }

  goToPreviousWorkstation() {
    // Decrement index with modulo to handle wrap-around
    this.currentWorkstationIndex--;

    // Update button states
    this.previousButton.disabled = this.currentWorkstationIndex === 1;
    this.nextButton.disabled = false; // Reset next button

    this.updateMessage();
  }

  goToNextWorkstation() {
    // Increment index with modulo to handle wrap-around
    this.currentWorkstationIndex++;

    // Update button states
    this.previousButton.disabled = false; // Reset previous button
    this.nextButton.disabled =
      this.currentWorkstationIndex === this.game.workstations.size;

    this.updateMessage();
  }

  getCurrentWorkstation() {
    return this.game.workstations.get(this.currentWorkstationIndex);
  }

  //DRAG stuff does not work
  dragStart(e) {
    e.dataTransfer.setData("text/plain", e.target.id);
    console.log("Drag Start: Setting ID", e.target.id);
    setTimeout(() => {
      e.target.classList.add("hide");
    }, 0);
  }

  dragEnter(e) {
    e.preventDefault();
    e.target.classList.add("drag-over");
  }

  dragOver(e) {
    e.preventDefault();
    e.target.classList.add("drag-over");
  }

  dragLeave(e) {
    e.target.classList.remove("drag-over");
  }

  drop(e) {
    e.target.classList.remove("drag-over");

    // get the draggable element
    const id = e.dataTransfer.getData("text/plain");
    const draggable = document.getElementById(id);

    console.log("Drop: Retrieved Element", draggable);

    if (draggable) {
      // add it to the drop target
      e.target.appendChild(draggable);

      // display the draggable element
      draggable.classList.remove("hide");
    }
  }
}

customElements.define("lean-game", LeanGame);
