class ShowStats extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
            <style>
                /* Style the statistics container */
                .statistics-container {
                    text-align: center;
                    margin-top: 20px;
                }
                .statistics-heading {
                    font-size: 1.5em;
                    margin-bottom: 10px;
                }
                .statistics-table {
                    width: 50%;
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
                .statistics-table td {
                    text-align: left;
                }
            </style>
            <div class="statistics-container">
                <h2 class="statistics-heading">Game Statistics</h2>
                <table class="statistics-table">
                    <tr>
                        <th>Statistic</th>
                        <th>Value</th>
                    </tr>
                    <tr>
                        <td>Total cars completed</td>
                        <td><span id="finalScore">0</span></td>
                    </tr>
                    <tr>
                        <td>Final stock</td>
                        <td><span id="finalStock">0</span> parts</td>
                    </tr>
                    <tr>
                        <td>Start capital</td>
                        <td><span id="startCapital">0</span>€</td>
                    </tr>
                    <tr>
                        <td>Fixt cost</td>
                        <td>- <span id="fixtCost">0</span>€</td>
                    </tr>
                    <tr>
                        <td>Var cost (10.000/car)</td>
                        <td>- <span id="varCost">0</span>€</td>
                    </tr>
                    <tr>
                        <td>Profit (20.000/car)</td>
                        <td>+ <span id="finalProfit">0</span>€</td>
                    </tr>
                    <tr>
                        <td>Final capital</td>
                        <td><span id="finalCapital">0</span>€</td>
                    </tr>
                    <!-- Add more statistics here if needed -->
                </table>
            </div>
        `;
    this.finalScoreElement = this.shadowRoot.querySelector("#finalScore");
    this.finalProfitElement = this.shadowRoot.querySelector("#finalProfit");
    this.finalStockElement = this.shadowRoot.querySelector("#finalStock");
    this.startCapitalElement = this.shadowRoot.querySelector("#startCapital");
    this.fixtCostElement = this.shadowRoot.querySelector("#fixtCost");
    this.varCostElement = this.shadowRoot.querySelector("#varCost");
    this.finalCapitalElement = this.shadowRoot.querySelector("#finalCapital");
  }

  // temp place for vars
  personeelskost = 3000;
  faciliteiten = 50000;
  vasteKost = this.personeelskost + this.faciliteiten;
  varKost = 10000; // per auto
  winst = 20000; //per auto

  // Methods to update the final stats
  updateStatistics(score, stock, capital) {
    this.newVarKost = this.varKost * score;
    this.newWinst = this.winst * score;

    this.finalScoreElement.textContent = score;
    this.finalProfitElement.textContent = this.newWinst;
    this.finalStockElement.textContent = stock;
    this.startCapitalElement.textContent = capital;
    this.fixtCostElement.textContent = this.vasteKost;
    this.varCostElement.textContent = this.newVarKost;
    this.finalCapitalElement.textContent =
      capital - this.vasteKost - this.newVarKost + this.newWinst;
  }
}

customElements.define("show-stats", ShowStats);
