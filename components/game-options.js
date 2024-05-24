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
                <h2 class="options-heading">Select Game Options</h2>
                <div class="option">
                    <input type="checkbox" id="timeLimit" name="timeLimit">
                    <label for="timeLimit">Time Limit (20s)</label>
                </div>
                <div class="option">
                    <input type="checkbox" id="kanban" name="kanban">
                    <label for="kanban">KANBAN</label>
                </div>
                <div class="option">
                    <input type="checkbox" id="jit" name="jit">
                    <label for="jit">Just in time (JIT)</label>
                </div>
                <div class="option">
                    <input type="checkbox" id="lineBalancing" name="lineBalancing">
                    <label for="lineBalancing">Line Balancing</label>
                </div>
                <div class="option">
                    <input type="checkbox" id="qc" name="qc">
                    <label for="qc">Quality Control</label>
                </div>
            </div>
        `;
  }

  connectedCallback() {
    const checkboxes = this.shadowRoot.querySelectorAll(
      'input[type="checkbox"]'
    );
    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", this.handleOptionChange.bind(this));
    });
  }

  handleOptionChange() {
    const selectedOptions = Array.from(
      this.shadowRoot.querySelectorAll('input[type="checkbox"]:checked')
    ).map((checkbox) => checkbox.id);

    this.dispatchEvent(
      new CustomEvent("optionschange", {
        detail: { selectedOptions },
        bubbles: true,
        composed: true,
      })
    );
  }
}

customElements.define("game-options", GameOptions);
