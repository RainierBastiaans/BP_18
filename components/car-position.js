class CarPositionLine extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="styles.css">
      <div class="car-position-line">
        <div class="car-position-box">
          <span class="car-position-q" id="q-1">0</span>
          <span class="car-position" id="workstation-1">1</span>
          <img src="./img/car-position/loading.gif" alt="loading gif" class="loading-gif">
          <img src="./img/car-position/little-wrench.svg" alt="wrench" class="wrench">
        </div>
        <div class="car-position-box">
          <span class="car-position-q" id="q-2">0</span>
          <span class="car-position" id="workstation-2">2</span>
          <img src="./img/car-position/loading.gif" alt="loading gif" class="loading-gif">
          <img src="./img/car-position/little-wrench.svg" alt="wrench" class="wrench">
        </div>
        <div class="car-position-box">
          <span class="car-position-q" id="q-3">0</span>
          <span class="car-position" id="workstation-3">3</span>
          <img src="./img/car-position/loading.gif" alt="loading gif" class="loading-gif">
          <img src="./img/car-position/little-wrench.svg" alt="wrench" class="wrench">
        </div>
        <div class="car-position-box">
          <span class="car-position-q" id="q-4">0</span>
          <span class="car-position" id="workstation-4">4</span>
          <img src="./img/car-position/loading.gif" alt="loading gif" class="loading-gif">
          <img src="./img/car-position/little-wrench.svg" alt="wrench" class="wrench">
        </div>
        <div class="car-position-box">
          <span class="car-position-q" id="q-5">0</span>
          <span class="car-position" id="workstation-5">5</span>
          <img src="./img/car-position/loading.gif" alt="loading gif" class="loading-gif">
          <img src="./img/car-position/little-wrench.svg" alt="wrench" class="wrench">
        </div>
      </div>
      `;

    this.workstationElements =
      this.shadowRoot.querySelectorAll(".car-position");
    this.loadingElements = this.shadowRoot.querySelectorAll(".loading-gif");
    this.wrenchElements = this.shadowRoot.querySelectorAll(".wrench");
  }

  setCarPositions(cars) {
    this.workstationElements.forEach((element, index) => {
      const workstationId = index + 1; // Adjust for 1-based indexing
      const hasCar = Array.from(cars.values()).some(
        (car) => car.state.workstationId === workstationId
      );
      element.textContent = workstationId; // Display workstation number
      element.classList.remove("active");
      this.loadingElements[index].classList.add("hidden");
      if (hasCar) {
        element.classList.add("active");
        this.loadingElements[index].classList.remove("hidden");
      }
    });
  }

  setCurrentWorkstation(workstations) {
    this.workstationElements.forEach((element, index) => {
      const workstationId = index + 1; // Adjust for 1-based indexing
      const workstation = Array.from(workstations.values()).find(
        (station) => station.id === workstationId
      ); // Find matching workstation

      if (workstation && workstation.getRemainingTime()) {
        element.style.backgroundColor = "red"; // Set background color for remaining time
        this.loadingElements[index].classList.add("hidden");
        this.wrenchElements[index].classList.remove("hidden");
      } else {
        element.style.backgroundColor = ""; // Clear background color
        this.wrenchElements[index].classList.add("hidden");
      }
    });
  }
  show() {
    this.classList.remove("hidden");
  }
  hide() {
    this.classList.add("hidden");
  }
}

customElements.define("car-position-line", CarPositionLine);

export { CarPositionLine };
