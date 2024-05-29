class RoundSummary extends HTMLElement {
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
          .summary-text {
            margin-bottom: 20px;
          }
        </style>
        <div id="options-container" class="options-container">
          <h2>Round Summary</h2>
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
    this.leanMethodRadioButtons = this.shadowRoot.querySelectorAll(
      'input[type="radio"][name="game-option"]'
    );
    this.leanMethodRadioButtons.forEach((radioButton) => {
      radioButton.addEventListener(
        "change",
        this.handleLeanMethodChange.bind(this)
      );
    });
  }
  handleLeanMethodChange(event) {
    const selectedLeanMethod = event.target.value;
    this.dispatchEvent(
      new CustomEvent("leanmethodchange", {
        detail: { selectedLeanMethod },
        bubbles: true,
        composed: true,
      })
    );
  }
}

customElements.define("round-summary", RoundSummary);

export { RoundSummary };
