import { gameTemplate } from "./gameplay/game-container.js";

class GameView extends HTMLElement {
  constructor() {
    super();
    const gameTemplate = document.createElement("template");
    gameTemplate.innerHTML = `
<link rel="stylesheet" href="styles.css">
<p id="message">Work On Workstation</p>
<div class="car-container" id="car-container"></div>
<button id="previous-station-button">Previous Station</button>
<button id="next-station-button">Next Station</button>
<p id="partsAddedElement">0/0 parts added</p>
<p id="completedCarsElement">Cars completed: 0</p>
<button id="move-car-button">Move Car to Next Station</button>
<button id = "quality-control">Quality Control</button> 
<button id = "remove-button">Remove Car</button>
<div id="current-workstation">
<span class="maintenance-timer"></span>
<div class="timer">
  <svg>
    <circle cx="50%" cy="50%" r="90"/>
    <circle cx="50%" cy="50%" r="90" pathLength="1" />
    <text x="100" y="100" text-anchor="middle"><tspan id="timeLeft"></tspan></text>
    <text x="100" y="120" text-anchor="middle">seconds till fixed</text>
  </svg>
</div>
`;

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(gameTemplate.content.cloneNode(true));
    //Get references DOM elements
    this.gameContainer = document.getElementById("game-container");

    //Initialize elements
    this.initializeElements();

    //Moet in model?
    this.timeLeft = 180; // Time in seconds
    this.timerInterval = null;
  }

  //get the game screen
  show(options) {
    //Show game container
    this.gameContainer.classList.remove("hidden");
    //Initialize elements
    this.initializeElements();
  }

  //hide the game screen
  hide() {
    this.gameContainer.classList.add("hidden");
  }

  initializeElements() {
    const shadowRoot = this.shadowRoot;
    this.messageEl = shadowRoot.getElementById("message");

    // Get the buttons
    this.previousButton = shadowRoot.getElementById("previous-station-button");
    this.nextButton = shadowRoot.getElementById("next-station-button");
    this.moveCarButton = shadowRoot.getElementById("move-car-button");
    this.qualityControlButton = shadowRoot.getElementById("quality-control");

    //Additional elements
    this.completedCarsElement = shadowRoot.getElementById(
      "completedCarsElement"
    );
    this.partsAddedElement = shadowRoot.getElementById("partsAddedElement");
    console.log(this.partsAddedElement);
    //initialize style
    this.qualityControlButton.style.visibility = "hidden";
    this.previousButton.disabled = true; // Initially disabled

    // Get part buttons
    this.partButtons = Array.from(shadowRoot.querySelectorAll(".part-button"));
    console.log(this.partButtons);
  }

  draw(workstation) {
    // Update visual representation based on maintenance status
    const workstationElement = document.getElementById("current-workstation");
    // if (workstationElement) {
    //   const seconds = workstation.getRemainingTime();
    //   if (seconds) {
    //     workstationElement.classList.add("under-maintenance");
    //     maintenanceTimer.textContent = `Machine broken, wait ${seconds}s`; // Combined message
    //   } else {
    //     workstationElement.classList.remove("under-maintenance");
    //     maintenanceTimer.textContent = ""; // Clear message
    //   }
    // }
  }

  //BIND ELEMENTS WITH EVENTLISTENERS TO CONTROLLERS
  bindPreviousButtonClick(callback) {
    this.previousButton.addEventListener("click", (event) => {
      callback();
    });
  }

  bindNextButtonClick(callback) {
    this.nextButton.addEventListener("click", (event) => {
      callback();
    });
  }

  bindMoveCarButtonClick(callback) {
    this.moveCarButton.addEventListener("click", (event) => {
      callback();
    });
  }

  bindQualityControlButtonClick(callback) {
    this.qualityControlButton.addEventListener("click", (event) => {
      callback();
    });
  }

  bindPartButtonClick(callback) {
    this.partButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        callback(event.target);
      });
    });
  }

  bindCheckRoundOver(callback) {
    this.addEventListener("checkRoundOver", (event) => {
      callback();
    });
  }

  // Methods for updating the UI
  updateMessage(message) {
    // ... (update previous/next button states)
    //this.clearButtons();
    this.messageEl.textContent = "Work on workstation " + message;
  }

  updateCompletedCars(amount) {
    // Update UI elements (assuming you have elements for displaying messages)
    this.completedCarsElement.textContent = `Cars completed: ${amount}`;
  }

  clearButtons() {
    const buttonContainer = document.querySelector("#part-buttons");
    const noCarContainer = document.querySelector(".no-car");

    // Remove elements in a single line using optional chaining
    buttonContainer?.remove();
    noCarContainer?.remove();
  }

  createButtonElements() {
    const buttonContainer = document.createElement("div");
    buttonContainer.id("part-buttons");
    this.shadowRoot.appendChild(buttonContainer);
    console.log(buttonContainer);
  }

  createPartButton(part, isPartAdded, handlePartButtonClick) {
    const partContainer = document.createElement("div");
    partContainer.classList.add("part-container");

    const count = this.getPartCount(part);
    for (let i = 0; i < count; i++) {
      const button = this.createPartButton(part, i);
      partContainer.appendChild(button);
    }
    const buttonContainer = document.querySelector("#part-buttons");
    if (!buttonContainer) {
      console.error("Button container not found" + buttonContainer);
      return;
    }
    this.moveCarButton.style.visibility = "visible";
    const button = document.createElement("button");
    const img = document.createElement("img");
    img.src = `../images/${part}.png`;
    img.alt = `image of ${part}`;
    button.classList.add("part-button");
    button.dataset.partName = part;
    //button.addEventListener("click", this.handleClick.bind(this));
    button.disabled = isPartAdded; //disable button if already added
    button.appendChild(img);
    console.log(button);
    this.shadowRoot.appendChild(buttonContainer);
    console.log(buttonContainer);
    buttonContainer.appendChild(button);
  }

  enableButtons(isCarComplete) {
    const buttonContainer = document.querySelector(".part-buttons");
    this.shadowRoot.appendChild(buttonContainer);

    // // Show quality control button conditionally
    // this.qualityControlButton.style.visibility =
    //   this.gameController.hasLeanMethod("qc") ? "visible" : "hidden";

    // Enable buttons based on workstation completion
    this.moveCarButton.disabled = !isCarComplete;
    this.qualityControlButton.disabled = !isCarComplete; // Optional chaining for safety
  }

  updatePartsAdded(partsMessage) {
    this.partsAddedElement.textContent = partsMessage;
  }

  createNoCarElement(textContent) {
    const noCarContainer = document.createElement("div");
    noCarContainer.classList.add("no-car");
    noCarContainer.textContent = textContent;
    console.log(noCarContainer);
    console.log(this.shadowRoot);
    console.log(textContent);
    console.log(noCarContainer.textContent);
    console.log(this.partsAddedElement);
    this.partsAddedElement.textContent = "";
    this.shadowRoot.appendChild(noCarContainer);
    this.moveCarButton.style.visibility = "hidden";
    this.qualityControlButton.style.visibility = "hidden";
  }

  updateCarStatus(carStatus) {
    // Code to update car status
  }

  updateQualityControl(qualityControlStatus) {
    // Code to update quality control status
  }

  carVisual(part, isPartAdded, isCarComplete) {
    try {
      const carContainer = this.shadowRoot.getElementById("car-container");
      const carPart = document.createElement("img");
      const checkImg = this.shadowRoot.getElementById(part);

      if (checkImg == null && isPartAdded) {
        carPart.className = "car-part";
        carPart.id = part;
        carPart.src = `../images/${part}.png`;
        carPart.alt = `image of ${part}`;
        carContainer.append(carPart);
      }

      //Check if car is complete

      if (isCarComplete()) {
        // if car complete wait 1 second and clear carContainer
        setTimeout(() => {
          carContainer.innerHTML = "";
        }, 1000);
      }
    } catch (error) {}
  }
}

customElements.define("lean-game", GameView);
export default GameView;
