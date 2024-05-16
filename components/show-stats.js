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
                .statistics-info {
                    font-size: 1.2em;
                }
            </style>
            <div class="statistics-container">
                <h2 class="statistics-heading">Game Statistics</h2>
                <p class="statistics-info">Your final score: <span id="finalScore">0</span> cars completed!</p>
                <p class="statistics-info">Your total profit: <span id="finalProfit">0</span>€</p>
                <p class="statistics-info">Your final stock: <span id="finalStock">0</span> parts!</p>
                <p class="statistics-info">Your final capital: <span id="finalCapital">0</span>€</p>
                <!-- Add more statistics here if needed -->
            </div>
        `;
    this.finalScoreElement = this.shadowRoot.querySelector("#finalScore");
    this.finalProfitElement = this.shadowRoot.querySelector("#finalProfit");
    this.finalStockElement = this.shadowRoot.querySelector("#finalStock");
    this.finalCapitalElement = this.shadowRoot.querySelector("#finalCapital");
  }

  // Methods to update the final stats
  updateScore(score) {
    this.finalScoreElement.textContent = score;
    this.finalProfitElement.textContent = score * 2000;
  }

  updateStock(stock) {
    this.finalStockElement.textContent = stock;
  }

  updateCapital(capital) {
    this.finalCapitalElement.textContent = capital;
  }
}

customElements.define("show-stats", ShowStats);
