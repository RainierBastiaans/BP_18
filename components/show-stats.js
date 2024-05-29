class ShowStats extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.shadowRoot.innerHTML = `
        <style>
          .statistics-container {
            text-align: center;
            margin-top: 20px;
          }
          .statistics-heading {
            font-size: 1.5em;
            margin-bottom: 10px;
          }
          .statistics-table {
            width: 100%;
            margin: 0 auto;
            border-collapse: collapse;
          }
          .statistics-table th, .statistics-table td {
            border: 1px solid #ddd;
            padding: 8px;
          }
          .statistics-table th {
            background-color: #f2f2f2;
            text-align: left;
          }
          .statistics-table td.round-number {
            text-align: center;
            font-weight: bold;
          }
        </style>
        <div class="statistics-container">
          <h2 class="statistics-heading">Game Statistics</h2>
          <table class="statistics-table">
            <tr>
              <th rowspan="3">Game Stats</th>
              <th>Total Cars Completed</th>
              <td id="carsCompleted">0</td>
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
      this.totalIncomeElement = this.shadowRoot.querySelector("#totalIncome");
      this.capitalElement = this.shadowRoot.querySelector("#capital");
    }
  
    // Methods to update the stats
    update(gameStats) {
      console.log(gameStats)
      this.carsCompletedElement.textContent = gameStats.carsCompleted;
      this.totalIncomeElement.textContent = gameStats.totalIncome + "€";
      this.capitalElement.textContent = gameStats.capital.amount + "€"
    }
  }
  
  customElements.define("show-stats", ShowStats);
  