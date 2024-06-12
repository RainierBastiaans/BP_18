import { gameValues } from "../game-values.js";

class ShowStats extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
    <link rel="stylesheet" href="styles.css">
    <div class="hidden" alt="References for icons of this component">
      <a href="https://www.flaticon.com/free-icons/capital-venture" title="capital venture icons">Capital venture icons created by Nhor Phai - Flaticon</a>
      <a href="https://www.flaticon.com/free-icons/work-in-progress" title="work in progress icons">Work in progress icons created by Aranagraphics - Flaticon</a>
      <a href="https://www.flaticon.com/free-icons/money" title="money icons">Money icons created by Freepik - Flaticon</a>
      <a href="https://www.flaticon.com/free-icons/fleet-management" title="fleet management icons">Fleet management icons created by prinda895 - Flaticon</a>
      <a href="https://www.flaticon.com/free-icons/car-accident" title="car accident icons">Car accident icons created by Prashanth Rapolu 15 - Flaticon</a>
      <a href="https://www.flaticon.com/free-icons/measure" title="measure icons">Measure icons created by Eucalyp - Flaticon</a>
    </div>
    `;
    this.classList.add("component-style");
    const statsComponent = document.createElement("div");
    statsComponent.classList.add("stats-component");
    this.shadowRoot.appendChild(statsComponent);
    this.currentRound = 0; // Track current round
  }

  update(gameStats) {
    this.gameStats = gameStats;
    this.render();
  }

  render() {
    const statsComponent = this.shadowRoot.querySelector(".stats-component");
    statsComponent.innerHTML = ""; // Clear existing stats
    //Heading
    const heading = document.createElement("div");
    //refactor
    heading.classList.add("shop-heading");
    heading.classList.add("horizontal-container");
    statsComponent.appendChild(heading);

    // Add a reference to the source of the stats icon
    const statsSourceContainer = document.createElement("div");
    statsSourceContainer.classList.add("hidden");
    heading.appendChild(statsSourceContainer);

    const statsSourceReference = document.createElement("a");
    statsSourceReference.href =
      "https://www.flaticon.com/free-icons/statistics";
    statsSourceReference.title = "statistics icon";
    statsSourceReference.alt = "Statistics icons created by Freepik - Flaticon";
    statsSourceContainer.appendChild(statsSourceReference);

    // Stats icon
    const statsIcon = document.createElement("img");
    statsIcon.src = "./img/show-stats/statistics.png";
    statsIcon.alt = "statistics icon";
    statsIcon.classList.add("header-icon");
    heading.appendChild(statsIcon);

    // Title
    const statsTitle = document.createElement("h2");
    statsTitle.textContent = "Your stats!";
    heading.appendChild(statsTitle);

    //Navigation
    const navigation = document.createElement("div");

    //refactor
    navigation.classList.add("shop-navigation");
    statsComponent.appendChild(navigation);

    //previous button
    const prevButton = document.createElement("button");
    prevButton.textContent = "Previous";
    prevButton.addEventListener("click", () => {
      this.changeRound(-1);
    });
    navigation.appendChild(prevButton);

    //Round number
    const roundNumber = document.createElement("span");
    roundNumber.classList.add("h2");
    roundNumber.classList.add("round-label");
    roundNumber.textContent = `Round ${this.currentRound + 1}`;
    navigation.appendChild(roundNumber);

    //next button
    const nextButton = document.createElement("button");
    nextButton.textContent = "Next";
    nextButton.addEventListener("click", () => {
      this.changeRound(1);
    });
    navigation.appendChild(nextButton);

    //Table / list of stats
    const statsList = document.createElement("ul");
    statsList.classList.add("stats-list");
    statsComponent.appendChild(statsList);

    //Render stats for current round
    this.renderRoundStats();
  }

  renderRoundStats() {
    const statsList = this.shadowRoot.querySelector(".stats-list");
    statsList.innerHTML = ""; // Clear existing stats

    const roundNumber = this.shadowRoot.querySelector(".round-label");
    roundNumber.innerHTML = "";
    roundNumber.textContent = `Round ${this.currentRound + 1}`;

    //get RoundStats object for current round
    const currentRoundStats = this.gameStats.rounds
      .get(this.currentRound + 1)
      .getRoundStats();

    /*=========================================
    =============BUILD STATS LIST===============
    =========================================*/
    //Cars produced
    const carsProducedTitle = "Cars produced";
    const carsProduced = currentRoundStats.carsCompleted;
    const carsProducedItem = this.buildStatItem(
      "carsProduced",
      carsProducedTitle,
      carsProduced
    );
    statsList.appendChild(carsProducedItem);

    //Cars Dead On Production
    const carsBrokenTitle = "Cars Dead On Production";
    const carsBroken = currentRoundStats.carsBroken;
    const carsBrokenItem = this.buildStatItem(
      "carsBroken",
      carsBrokenTitle,
      carsBroken
    );
    statsList.appendChild(carsBrokenItem);

    //Cars in progress
    const carsInProgressTitle = "Cars in progress";
    const carsInProgress = currentRoundStats.carsInProgress;
    const carsInProgressItem = this.buildStatItem(
      "carsInProgress",
      carsInProgressTitle,
      carsInProgress
    );
    statsList.appendChild(carsInProgressItem);

    //Total income
    const totalIncomeTitle = "Total income";
    const totalIncome = currentRoundStats.totalIncome;
    const totalIncomeItem = this.buildStatItem(
      "totalIncome",
      totalIncomeTitle,
      totalIncome
    );
    statsList.appendChild(totalIncomeItem);

    //Total Capital
    const capitalTitle = "Total Capital";
    const capital = currentRoundStats.capital;
    const capitalItem = this.buildStatItem("capital", capitalTitle, capital);
    statsList.appendChild(capitalItem);

    //Average car production time
    const averageCarCompletionTimeTitle = "Average car production time";
    const averageCarCompletionTime = currentRoundStats.averageCarCompletionTime;
    const averageCarCompletionTimeItem = this.buildStatItem(
      "averageCarCompletionTime",
      averageCarCompletionTimeTitle,
      averageCarCompletionTime
    );
    statsList.appendChild(averageCarCompletionTimeItem);
  }

  buildStatItem(itemName, statName, statNumber) {
    const statItem = document.createElement("li");
    statItem.classList.add("stat-item");

    const statTitleContainer = document.createElement("div");
    statTitleContainer.classList.add("stat-title-container");
    statItem.appendChild(statTitleContainer);

    const statImage = document.createElement("img");
    statImage.classList.add("icon");
    statImage.src = `./img/show-stats/${itemName}.png`;
    statImage.alt = `${statName} icon`;
    statTitleContainer.appendChild(statImage);

    const statTitle = document.createElement("span");
    statTitle.classList.add("stat-title");
    statTitle.textContent = statName;
    statTitleContainer.appendChild(statTitle);

    const statValue = document.createElement("span");
    statValue.classList.add("stat-value");
    statValue.textContent = statNumber;
    statItem.appendChild(statValue);

    return statItem;
  }

  changeRound(offset) {


    if (this.currentRound + offset < 0) {
      return;
    } else if (
      this.currentRound + offset > this.gameStats.rounds.size ||
      this.currentRound + offset === gameValues.numberOfRounds
    ) {
      return;
    }

    const isOver = this.gameStats.rounds.get(
      this.currentRound + 1 + offset
    ).isOver;

    if (!isOver) {
      return;
    }

    const roundSize = this.gameStats.rounds.size;

    // Calculate new round number
    const newIndex = (this.currentRound + offset + roundSize) % roundSize;

    // Update current round
    this.currentRound = newIndex;
    //Render stats for new round
    this.renderRoundStats();
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
