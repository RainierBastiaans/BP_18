class CarPositionLine extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="styles.css">
        <div class="car-position-line">
          <span class="car-position" id="workstation-1">1</span>
          <span class="car-position" id="workstation-2">2</span>
          <span class="car-position" id="workstation-3">3</span>
          <span class="car-position" id="workstation-4">4</span>
          <span class="car-position" id="workstation-5">5</span>
        </div>
      `;

    this.workstationElements =
      this.shadowRoot.querySelectorAll(".car-position");
  }

  setCarPositions(cars) {
    this.workstationElements.forEach((element, index) => {
      const workstationId = index + 1; // Adjust for 1-based indexing
      const hasCar = Array.from(cars
        .values())
        .some((car) => car.state.workstationId === workstationId);
      element.textContent = workstationId; // Display workstation number
      element.classList.remove("active");
      if (hasCar) {
        element.classList.add("active");
      }
    });
  }

  setCurrentWorkstation(workstations) {
    this.workstationElements.forEach((element, index) => {
      const workstationId = index + 1; // Adjust for 1-based indexing
      const workstation = Array.from(workstations
        .values())
        .find((station) => station.id === workstationId); // Find matching workstation

      if (workstation && workstation.getRemainingTime()) {
        element.style.backgroundColor = "red"; // Set background color for remaining time
      } else {
        element.style.backgroundColor = ""; // Clear background color
      }
    });
  }
  show(){
    this.classList.remove("hidden")
  }
  hide(){
    this.classList.add("hidden")
  }
}

customElements.define("car-position-line", CarPositionLine);

export { CarPositionLine };
