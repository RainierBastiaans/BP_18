class ShowStats extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="styles.css">
        <div class="statistics-container">
          <h2 class="statistics-heading">Game Statistics</h2>
          <table class="statistics-table">
            <tr>
              <th rowspan="4">Game Stats</th>
              <th>Total Cars Completed</th>
              <td id="carsCompleted">0</td>
            </tr>
            <tr>
              <th>Total Cars Broken</th>
              <td id="carsBroken">0</td>
            </tr>
            <tr>
              <th>Total Income</th>
              <td id="totalIncome">0€</td>
            </tr>
            <tr>
              <th>Capital</th>
              <td id="capital">0€</td>
            </tr>
            <tr id="roundHeaders"></tr>
            <tbody id="roundStats"></tbody>
          </table>
        </div>
      `;
    this.carsCompletedElement = this.shadowRoot.querySelector("#carsCompleted");
    this.carsBrokenElement = this.shadowRoot.querySelector("#carsBroken");
    this.totalIncomeElement = this.shadowRoot.querySelector("#totalIncome");
    this.capitalElement = this.shadowRoot.querySelector("#capital");
  }

  // Methods to update the stats
  update(gameStats) {
    this.carsCompletedElement.textContent = gameStats.carsCompleted;
    this.carsBrokenElement.textContent = gameStats.carsBroken;
    this.totalIncomeElement.textContent = gameStats.totalIncome + "€";
    this.capitalElement.textContent = gameStats.capital.amount + "€";
  }
}

customElements.define("show-stats", ShowStats);
