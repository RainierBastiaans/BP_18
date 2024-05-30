import "./index.js";
import "./components/game-header.js";
import "./components/game-description.js";
import "./components/start-button.js";
import "./components/show-stats.js";
import "./components/game-options.js";

document.addEventListener("DOMContentLoaded", () => {
  let selectedLeanMethod; // To store selected options
  let selectedWorkstation;

  document
    .querySelector("game-options")
    .addEventListener("workstationchange", (event) => {
      selectedWorkstation = parseInt(event.detail.workstation);
    });

  document
    .querySelector("round-summary")
    .addEventListener("leanmethodchange", (event) => {
      selectedLeanMethod = event.detail.selectedLeanMethod;
    });

  // Game start
  document.querySelector("start-button").addEventListener("startgame", () => {
    document.querySelector("game-header").classList.add("hidden");
    document.querySelector("game-description").classList.add("hidden");
    document.querySelector("start-button").classList.add("hidden");
    document.getElementById("game-container").classList.remove("hidden");
    document.getElementById("stats-container").classList.remove("hidden");
    document.querySelector("game-options").classList.add("hidden");

    document.getElementById(
      "game-container"
    ).innerHTML = `<lean-game options='${JSON.stringify({
      selectedWorkstation,
    })}'></lean-game>`;
    document
      .getElementById("game-container")
      .querySelector("lean-game")
      .game.stats.addObserver(document.getElementById("stats-container").querySelector("show-stats"));
  });
  document
    .querySelector("new-round-button")
    .addEventListener("newRound", (event) => {
      // Access the selected lean method from the event detail
      document.querySelector("game-header").classList.add("hidden");
      document.querySelector("new-round-button").classList.add("hidden");
      document.getElementById("stats-container").classList.remove("hidden");
      document.querySelector("round-summary").classList.add("hidden");

      document.getElementById("game-container").classList.remove("hidden");
      const leanGame = document
        .getElementById("game-container")
        .querySelector("lean-game");
      // Pass the selected lean method to the newRound method
      leanGame.newRound(selectedLeanMethod);
    });

  //Round end
  document.addEventListener("roundover", (event) => {
    const { gameStats, leanMethods} = event.detail;

    //update statistics
    const showStatsComponent = document.querySelector("show-stats");
    showStatsComponent.update(gameStats);

    // Show statistics and reset home screen
    document.querySelector("game-header").classList.remove("hidden");
    document.querySelector("new-round-button").classList.remove("hidden");
    document.getElementById("game-container").classList.add("hidden");
    document.getElementById("stats-container").classList.remove("hidden");
    const roundsummaryElement = document.querySelector("round-summary")
    roundsummaryElement.showLeanMethods(leanMethods)
    roundsummaryElement.classList.remove("hidden");
  });

  //Game end
  document.addEventListener("gameover", (event) => {
    const { gameStats} = event.detail;

    //update statistics
    const showStatsComponent = document.querySelector("show-stats");
    showStatsComponent.update(gameStats);

    // Show statistics and reset home screen
    document.querySelector("game-header").classList.remove("hidden");
    document.querySelector("game-description").classList.remove("hidden");
    document.querySelector("start-button").classList.remove("hidden");
    document.getElementById("game-container").classList.add("hidden");
    document.getElementById("stats-container").classList.remove("hidden");
    document.querySelector("game-options").classList.remove("hidden");
  });
});
