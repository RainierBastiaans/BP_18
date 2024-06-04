class GameOptions extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="styles.css">
      <div id="options-container" class="options-container">
      <h3>Select Workstation you want to operate:</h3>
        <div class="workstation-options">
          <div class="workstation-option">
            <input type="radio" id="workstation-1" name="workstation" value="1">
            <label for="workstation-1">1</label>
          </div>
          <div class="workstation-option">
            <input type="radio" id="workstation-2" name="workstation" value="2">
            <label for="workstation-2">2</label>
          </div>
          <div class="workstation-option">
            <input type="radio" id="workstation-3" name="workstation" value="3">
            <label for="workstation-3">3</label>
          </div>
          <div class="workstation-option">
            <input type="radio" id="workstation-4" name="workstation" value="4">
            <label for="workstation-4">4</label>
          </div>
          <div class="workstation-option">
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
  show(){
    this.classList.remove("hidden")
  }
  hide(){
    this.classList.add("hidden")
  }
}

customElements.define("game-options", GameOptions);

export { GameOptions };
