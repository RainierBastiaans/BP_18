import { gameValues } from "../game-values.js";

class ShowStats extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  update(gameStats) {
    this.render(gameStats);
  }

  render(gameStats) {
    const numRounds = gameStats.rounds.size - 1;
    const tableHtml = `
      <link rel="stylesheet" href="styles.css">
      <div class="statistics-container">
        <h2 class="statistics-heading">Game Statistics</h2>
        <table class="statistics-table">
          <thead>
            <tr>
            <th></th>
              <th>Cars Completed</th>
              <th>Cars In Progress</th>
              <th>Cars Broken</th>
              <th>Total Income</th>
              <th>Capital</th>
              <th>Average Completion Time</th>


            </tr>
          </thead>
          <tbody>
          <tr>
          <td>Game</td>
          <td>${gameStats.carsCompleted}</td>
          <td>${gameStats.carsInProgress}</td>
          <td>${gameStats.carsBroken}</td>
          <td>${gameStats.totalIncome}</td>
          <td>${gameStats.capital.amount}</td>
          <td>${gameStats.averageCarCompletionTime}</td>

          
        </tr>
        ${Array.from(gameStats.rounds.values())
          .map((round) => `<tr>
          <td>Round ${round.roundNumber}</td>
          <td>${round.carsCompleted}</td>
          <td>${round.carsInProgress}</td>
          <td>${round.carsBroken}</td>
          <td>${round.totalIncome}</td>
          <td>${round.capital}</td>
          <td>${round.averageCarCompletionTime}</td>
          
        </tr>`)
          .join("")}
            </tbody>
        </table>
      </div>
    `;

    this.shadowRoot.innerHTML = tableHtml;

    this.updateRoundStats(gameStats.rounds);

    this.gameRowElements = this.shadowRoot.querySelectorAll(".game-row");
    // this.gameRowElements[0].querySelector("td").textContent = gameStats.carsCompleted;
    // this.gameRowElements[1].querySelector("td").textContent = gameStats.carsBroken;
    // // ... update other game row elements ...

    // this.roundStatsElement = this.shadowRoot.querySelector("#roundStats"); // (Optional, for future use)
  }

  updateRoundStats(roundStats) {
    // Update round-specific data logic here (optional)
  }

  show() {
    this.classList.remove("hidden");
  }

  hide() {
    this.classList.add("hidden");
  }
}

customElements.define("show-stats", ShowStats);
export { ShowStats };
