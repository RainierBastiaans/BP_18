class GameOptions extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="styles.css">
      <div id="options-container" class="options-container vertical-container">
      <div class="horizontal-container"> 
        <a href="https://www.flaticon.com/free-icons/workroom" title="workroom icons"
          alt="Workroom icons created by Hat Tech - Flaticon">
          <img src="./img/workstationIcon.png" alt="general workstation icon" class="workstation-icon">
        </a>
        <h3>Select the workstation you would like to operate</h3>
      </div>
        <div class="workstation-options vertical-container">
          <div class="workstation-option horizontal-container">
            <a href="<a href="https://www.flaticon.com/free-icons/chassis" title="chassis icons" 
                  alt="Chassis icons created by Andrejs Kirma - Flaticon">
              <img src="./img/workstationSelect1.png" alt="workstation 1 icon" class="workstation-icon">
            </a>
            <input type="radio" id="workstation-1" name="workstation" value="1">
            <label for="workstation-1">1</label>
          </div>
          <div class="workstation-option horizontal-container">
            <a href="https://www.flaticon.com/free-icons/motor" title="motor icons" 
                  alt="Motor icons created by monkik - Flaticon">
              <img src="./img/workstationSelect2.png" alt="workstation 2 icon" class="workstation-icon">
            </a>
            <input type="radio" id="workstation-2" name="workstation" value="2">
            <label for="workstation-2">2</label>
          </div>
          <div class="workstation-option horizontal-container">
            <a href="https://www.flaticon.com/free-icons/interior" title="interior icons" 
                  alt="Interior icons created by maswan - Flaticon">
              <img src="./img/workstationSelect3.png" alt="workstation 3 icon" class="workstation-icon">
            </a>
            <input type="radio" id="workstation-3" name="workstation" value="3">
            <label for="workstation-3">3</label>
          </div>
          <div class="workstation-option horizontal-container">
            <a href="https://www.flaticon.com/free-icons/battery" title="battery icons" 
                  alt="Battery icons created by Uniconlabs - Flaticon">
              <img src="./img/workstationSelect4.png" alt="player icon" class="workstation-icon">
            </a>
            <input type="radio" id="workstation-4" name="workstation" value="4">
            <label for="workstation-4">4</label>
          </div>
          <div class="workstation-option horizontal-container">
            <a href="https://www.flaticon.com/free-icons/assembly-line" title="assembly-line icons" 
                  alt="Assembly-line icons created by Eucalyp - Flaticon">
              <img src="./img/workstationSelect5.png" alt="player icon" class="workstation-icon">
            </a>
            <input type="radio" id="workstation-5" name="workstation" value="5">
            <label for="workstation-5">5</label>
          </div>
        </div>
      </div> 
    `;
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
  show() {
    this.classList.remove("hidden");
  }
  hide() {
    this.classList.add("hidden");
  }
}

customElements.define("game-options", GameOptions);

export { GameOptions };
