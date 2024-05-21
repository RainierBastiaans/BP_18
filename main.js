import "./index.js";
import "./components/game-header.js";
import "./components/game-description.js";
import "./components/start-button.js";
import "./components/show-stats.js";
import "./components/game-options.js";

document.addEventListener("DOMContentLoaded", () => {
  let selectedOptions = []; // To store selected options

  document
    .querySelector("game-options")
    .addEventListener("optionschange", (event) => {
      selectedOptions = event.detail.selectedOptions;
    });

  //Game start
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
      selectedOptions
    )}'></lean-game>`;
  });

  //Game end
  document.addEventListener("gameover", (event) => {
    const { score, stock, capital } = event.detail;

    //update statistics
    const showStatsComponent = document.querySelector("show-stats");
    showStatsComponent.updateStatistics(score, stock, capital);

    // Show statistics and reset home screen
    document.querySelector("game-header").classList.remove("hidden");
    document.querySelector("game-description").classList.remove("hidden");
    document.querySelector("start-button").classList.remove("hidden");
    document.getElementById("game-container").classList.add("hidden");
    document.getElementById("stats-container").classList.remove("hidden");
    document.querySelector("game-options").classList.remove("hidden");
  });
});
