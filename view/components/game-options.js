class GameOptions extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="styles.css">
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
                  <div class="player-container">
                    <div>
                      <p>up</p>
                      <p>down</p>
                    </div>
                    <div>
                      <p>up</p>
                      <p>down</p>
                    </div>
                    <p>number of players: 0</p>
                    <p>number of bots: 5</p>
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
