class SelectWorkstation extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="styles.css">
      <div id="workstation-options-container" class="workstation-options-container vertical-container">
        <div class="horizontal-container"> 
          <!-- <a href="https://www.flaticon.com/free-icons/workroom" title="workroom icons"
          alt="Workroom icons created by Hat Tech - Flaticon"> </a>-->
          <img src="./img/workstationIcon.png" alt="general workstation icon" class="workstation-icon">
          <h3>Select the workstation you would like to operate</h3>
        </div>
        <div class="workstation-options horizontal-container">
          <div class="hidden" alt="References for icons of workstations">
            <a href="https://www.flaticon.com/free-icons/chassis" title="chassis icons" alt="Chassis icons created by Andrejs Kirma - Flaticon"> </a>
            <a href="https://www.flaticon.com/free-icons/motor" title="motor icons" alt="Motor icons created by monkik - Flaticon"> </a>
            <a href="https://www.flaticon.com/free-icons/interior" title="interior icons" alt="Interior icons created by maswan - Flaticon"> </a>
            <a href="https://www.flaticon.com/free-icons/battery" title="battery icons" alt="Battery icons created by Uniconlabs - Flaticon"> </a>
            <a href="https://www.flaticon.com/free-icons/assembly-line" title="assembly-line icons" alt="Assembly-line icons created by Eucalyp - Flaticon"> </a>
          </div>
          ${this.createWorkstationOption(1)}
          ${this.createWorkstationOption(2)}
          ${this.createWorkstationOption(3)}
          ${this.createWorkstationOption(4)}
          ${this.createWorkstationOption(5)}
        </div>
      </div>
    `;
    this.classList.add("component-style");
  }

  connectedCallback() {
    this.workstationRadioButtons = this.shadowRoot.querySelectorAll(
      'input[type="radio"][name="workstation"]'
    );
    this.workstationRadioButtons.forEach((radioButton) => {
      radioButton.addEventListener(
        "change",
        this.handleWorkstationChange.bind(this)
      );
    });

    // Pre-select the first workstation by default (optional)
    this.workstationRadioButtons[0].checked = true;
    this.selectedWorkstation = 1;
  }

  handleWorkstationChange(event) {
    this.selectedWorkstation = event.target.value; // Get value from either lean method or workstation radio
    this.dispatchEvent(
      new CustomEvent("workstationchange", {
        detail: { workstation: this.selectedWorkstation },
        bubbles: true,
        composed: true,
      })
    );
  }

  createWorkstationOption(workstationIndex) {
    return `
      <div class="workstation-option horizontal-container">
        <img src="./img/workstationSelect${workstationIndex}.png" alt="workstation ${workstationIndex} icon" class="workstation-icon">
        <input type="radio" id="workstation-${workstationIndex}" name="workstation" value="${workstationIndex}">
        <label for="workstation-${workstationIndex}">${workstationIndex}</label>
      </div>
    `;
  }

  show() {
    this.classList.remove("hidden");
  }
  hide() {
    this.classList.add("hidden");
  }
}

customElements.define("select-workstation", SelectWorkstation);

export { SelectWorkstation };
