import { Game } from "./Models/game.js";

const gameTemplate = document.createElement("template");
gameTemplate.innerHTML = `
<p id="message">Work On Workstation</p>
<canvas id="bp-game-canvas" width="500" height="300"></canvas>
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
    this.game.newGame();

    this.currentWorkstationIndex = 1;

    this.ctx = this.canvas.getContext("2d");

    this.previousButton.addEventListener("click", this.handleClick.bind(this));
    this.nextButton.addEventListener("click", this.handleClick.bind(this));
    this.moveCarButton.addEventListener("click", this.handleClick.bind(this));

    this.adjustSettingsForOptions();
    this.updateMessage();

    // Add event listener for setInterval
    this.intervalId = setInterval(() => {
      this.draw();
      this.updateMessage();
      if (this.game.currentRound.isOver) {
        this.endRound();
      }
    }, 500); // Call every 0.5 seconds (500 milliseconds)
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

  adjustSettingsForOptions() {
    if (this.options.includes("timeLimit")) {
      this.timeLeft = 20;
    } else {
      this.timeLeft = 2;
    }
  }

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
    this.updateMessage();
  }

  handlePartButtonClick(button) {
    const partName = button.dataset.partName;
    this.game.addPart(partName, this.getCurrentWorkstation().id);
    this.updateMessage();
  }

  updateMessage() {
    // ... (update previous/next button states)
    this.clearPartButtons();

    this.messageEl.textContent =
      "Work On Workstation " + this.getCurrentWorkstation().id;
    // Update UI elements (assuming you have elements for displaying messages)
    this.completedCarsElement.textContent = `Cars completed: ${this.game.stats.carsCompleted}`;

    if (this.game.getCarFromWorkstation(this.getCurrentWorkstation().id)) {
      this.createPartButtons();

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
      button.classList.add("part-button");
      button.textContent = part.name;
      button.dataset.partName = part.name;
      button.addEventListener("click", this.handleClick.bind(this));
      button.disabled = this.game
        .getCarFromWorkstation(this.getCurrentWorkstation().id)
        .isAdded(part); //disable button if already added
      buttonContainer.appendChild(button);
    });

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
}

customElements.define("lean-game", LeanGame);
