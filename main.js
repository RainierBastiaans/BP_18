import "./index.js";
import "./components/game-header.js";
import "./components/game-description.js";
import "./components/start-button.js";
import "./components/show-stats.js";
import "./components/game-options.js";

document.addEventListener("DOMContentLoaded", () => {
  let selectedOption = []; // To store selected options
  let selectedWorkstation;

  document
    .querySelector("game-options")
    .addEventListener("optionschange", (event) => {
      selectedOption = event.detail.selectedOption;
      selectedWorkstation = event.detail.workstation;
    });

  // Game start
  document.querySelector("start-button").addEventListener("startgame", () => {
    document.querySelector("game-header").classList.add("hidden");
    document.querySelector("game-description").classList.add("hidden");
    document.querySelector("start-button").classList.add("hidden");
    document.getElementById("game-container").classList.remove("hidden");
    document.getElementById("stats-container").classList.add("hidden");
    document.querySelector("game-options").classList.add("hidden");

    document.getElementById(
      "game-container"
    ).innerHTML = `<lean-game options='${JSON.stringify(
      { selectedWorkstation }
    )}'></lean-game>`;
  });

  document
  .querySelector("new-round-button")
  .addEventListener("newRound", (event) => {
    // Access the selected lean method from the event detail
    const selectedLeanMethod = selectedOption;

    document.querySelector("game-header").classList.add("hidden");
    document.querySelector("new-round-button").classList.add("hidden");
    document.getElementById("stats-container").classList.add("hidden");
    document.querySelector("game-options").classList.add("hidden");

    document.getElementById("game-container").classList.remove("hidden");
    const leanGame = document
      .getElementById("game-container")
      .querySelector("lean-game");
    // Pass the selected lean method to the newRound method
    leanGame.newRound(selectedLeanMethod);
  });


  //Round end
  document.addEventListener("roundover", (event) => {
    const { gameStats, roundStats, capital } = event.detail;

    //update statistics
    const showStatsComponent = document.querySelector("show-stats");
    showStatsComponent.updateStatistics(gameStats, roundStats, capital);

    // Show statistics and reset home screen
    document.querySelector("game-header").classList.remove("hidden");
    document.querySelector("new-round-button").classList.remove("hidden");
    document.getElementById("game-container").classList.add("hidden");
    document.getElementById("stats-container").classList.remove("hidden");
    document.querySelector("game-options").classList.remove("hidden");
  });

  //Game end
  document.addEventListener("gameover", (event) => {
    const { gameStats, roundStats, capital } = event.detail;

    //update statistics
    const showStatsComponent = document.querySelector("show-stats");
    showStatsComponent.updateStatistics(gameStats, roundStats, capital);

    // Show statistics and reset home screen
    document.querySelector("game-header").classList.remove("hidden");
    document.querySelector("game-description").classList.remove("hidden");
    document.querySelector("start-button").classList.remove("hidden");
    document.getElementById("game-container").classList.add("hidden");
    document.getElementById("stats-container").classList.remove("hidden");
    document.querySelector("game-options").classList.remove("hidden");
  });
});
