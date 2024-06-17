import { formatLargeNumber } from "../format-number.js";

class ShowIngameStats extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
    <link rel="stylesheet" href="styles.css">
    <div class="ingame-statistics-container horizontal-container">
      <div class="ingame-statistics-item" title="Number of completed cars">
          <img src="./img/show-stats/carsProduced.png" alt="completed cars" class="icon">
          <p id="carsCompleted">0</p>
      </div>
      <div class="ingame-statistics-item" title="Number of broken cars">
          <img src="./img/show-stats/carsBroken.png" alt="broken cars" class="icon">
          <p id="carsBroken">0</p>
      </div>
      <div class="ingame-statistics-item" title="Total profit">
          <img src="./img/show-stats/totalIncome.png" alt="profit" class="icon">
          <p id="totalIncome">€ 0</p>
      </div>
      <div class="ingame-statistics-item" title="Total capital">
          <img src="./img/show-stats/capital.png" alt="capital" class="icon">
          <p id="capital">€ 0</p>
      </div>
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
    this.totalIncomeElement.textContent = ("€ " + formatLargeNumber(gameStats.totalIncome));
    this.capitalElement.textContent = ("€ " + formatLargeNumber(gameStats.capital.amount));
  }

  show() {
    this.classList.remove("hidden");
  }
  hide() {
    this.classList.add("hidden");
  }
}

customElements.define("show-ingame-stats", ShowIngameStats);
export { ShowIngameStats };
