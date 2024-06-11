class ShowStats extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    //style and header
    // this.shadowRoot.innerHTML = `
    // <link rel="stylesheet" href="styles.css">
    // `;
    this.classList.add("component-style");
    this.classList.add("stats-component");
    this.currentRound = 0; // Track current round
  }

  update(gameStats) {
    this.render(gameStats);
  }

  render(gameStats) {
    this.shadowRoot.innerHTML = `
    <link rel="stylesheet" href="styles.css">
    `;
    console.log(gameStats);
    //Heading
    const heading = document.createElement("div");
    //refactor
    heading.classList.add("shop-heading");
    heading.classList.add("horizontal-container");
    this.shadowRoot.appendChild(heading);

    // Add a reference to the source of the stats icon
    const statsSourceContainer = document.createElement("div");
    statsSourceContainer.classList.add("hidden");
    heading.appendChild(statsSourceContainer);

    const statsSourceReference = document.createElement("a");
    statsSourceReference.href = "https://www.flaticon.com/free-icons/warehouse";
    statsSourceReference.title = "warehouse icons";
    statsSourceReference.alt =
      "represented by: Warehouse icons created by Vectors Tank - Flaticon";
    statsSourceContainer.appendChild(statsSourceReference);

    // Stats icon
    const statsIcon = document.createElement("img");
    statsIcon.src = "./img/warehouseIcon.png";
    statsIcon.alt = "warehouse icon";
    statsIcon.classList.add("warehouse-icon");
    heading.appendChild(statsIcon);

    // Title
    const statsTitle = document.createElement("h2");
    statsTitle.textContent = "Your stats!";
    heading.appendChild(statsTitle);

    //Navigation
    const navigation = document.createElement("div");

    //refactor
    navigation.classList.add("shop-navigation");
    this.shadowRoot.appendChild(navigation);

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
    roundNumber.textContent = `Round ${this.currentRound}`;
    navigation.appendChild(roundNumber);

    //next button
    const nextButton = document.createElement("button");
    nextButton.textContent = "Next";
    nextButton.addEventListener("click", () => {
      this.changeRound(1);
    });
    navigation.appendChild(nextButton);

    //Render stats for current round
    this.renderRoundStats(gameStats);
  }

  renderRoundStats(gameStats) {
    //Table / list of stats
    const statsList = document.createElement("ul");
    statsList.classList.add("stats-list");
    this.shadowRoot.appendChild(statsList);

    const roundNumber = this.shadowRoot.querySelector(".round-label");
    roundNumber.innerHTML = "";
    roundNumber.textContent = `Round ${this.currentRound}`;
    statsList.innerHTML = ""; // Clear existing stats

    //get RoundStats object for current round
    console.log(gameStats.rounds.get(this.currentRound + 1));
    const currentRoundStats = gameStats.rounds
      .get(this.currentRound + 1)
      .getRoundStats();
    console.log(currentRoundStats);

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
      "carsProduced",
      averageCarCompletionTimeTitle,
      averageCarCompletionTime
    );
    averageCarCompletionTimeItem.classList.add("average-car-time");
  }

  buildStatItem(itemName, statName, statNumber) {
    const statItem = document.createElement("li");
    statItem.classList.add("stat-item");

    const statTitleContainer = document.createElement("div");
    statTitleContainer.classList.add("stat-title-container");
    statItem.appendChild(statTitleContainer);

    const statImage = document.createElement("img");
    statImage.classList.add("stat-image");
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
