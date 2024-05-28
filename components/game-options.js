class GameOptions extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = `
      <style>
        .options-container {
          text-align: center;
          margin: 20px;
        }
        .options-heading {
          font-size: 1.5em;
          margin-bottom: 10px;
        }
        .workstation-options {
          display: flex;
          justify-content: center;
          margin: 10px 0;
        }
        .workstation-option {
          margin-right: 10px;
        }
      </style>
      <div id="options-container" class="options-container">
        <h2>Select Lean Method</h2>
        <div class="option">
          <input type="radio" id="jit" name="game-option" value="jit">
          <label for="jit">Just in time (JIT)</label>
        </div>
        <div class="option">
          <input type="radio" id="qc" name="game-option" value="qc">
          <label for="qc">Quality Control</label>
        </div>
        <div class="option">
          <input type="radio" id="tpm" name="game-option" value="tpm">
          <label for="tpm">Total Productive Maintenance</label>
        </div>
        <div class="workstation-options">
          <label>Workstation:</label>
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
    this.workstationRadioButtons = this.shadowRoot.querySelectorAll('input[type="radio"][name="workstation"]');
    this.leanMethodRadioButtons = this.shadowRoot.querySelectorAll('input[type="radio"][name="game-option"]');
    this.workstationRadioButtons.forEach((radioButton) => {
      radioButton.addEventListener("change", this.handleOptionChange.bind(this));
    });

    // Pre-select the first workstation by default (optional)
    this.workstationRadioButtons[0].checked = true;
    this.selectedWorkstation = 1;
  }

  handleOptionChange(event) {
    this.selectedWorkstation = event.target.value; // Get value from either lean method or workstation radio
    console.log(this.selectedWorkstation)
    const selectedLeanMethod = parseInt(this.shadowRoot.querySelector('input[type="radio"][name="game-option"]:checked')?.value);

    this.dispatchEvent(
      new CustomEvent("optionschange", {
        detail: { selectedLeanMethod, workstation: this.selectedWorkstation },
        bubbles: true,
        composed: true,
      })
    );
  }
}

customElements.define("game-options", GameOptions);

export { GameOptions };
