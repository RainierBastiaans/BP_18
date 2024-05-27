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
        .option {
          margin: 5px 0;
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
      </div>
    `;
  }

  connectedCallback() {
    const radioButtons = this.shadowRoot.querySelectorAll(
      'input[type="radio"]'
    );
    radioButtons.forEach((radioButton) => {
      radioButton.addEventListener(
        "change",
        this.handleOptionChange.bind(this)
      );
    });
  }

  handleOptionChange(event) {
    const selectedOption = event.target.value;
    this.dispatchEvent(
      new CustomEvent("optionschange", {
        detail: { selectedOption },
        bubbles: true,
        composed: true,
      })
    );
  }
}

customElements.define("game-options", GameOptions);

export { GameOptions }; // Export for use in other modules (optional)
