import "./index.js";
import "./components/game-header.js";
import "./components/game-description.js";
import "./components/start-button.js";
import "./components/show-stats.js";
import "./components/game-options.js";
import { GameFacade } from "./model/gameFacade.js";

document.addEventListener("DOMContentLoaded", () => {
  const gameHeader = document.querySelector("game-header");
  const gameDescription = document.querySelector("game-description");
  const gameContainer = document.getElementById("game-container");
  const statsContainer = document.getElementById("stats-container");
  const startButton = document.querySelector("start-button");
  const newRoundButton = document.querySelector("new-round-button");
  const showStats = document.querySelector("show-stats");
  const gameOptions = document.querySelector("game-options");

  // Initialize the game facade
  const gameFacade = new GameFacade();

  let selectedOption = []; // To store selected options

  gameOptions.addEventListener("optionschange", (event) => {
    selectedOption = event.detail.selectedOption;
  });

  //Game start
  startButton.addEventListener("startgame", () => {
    //Hide home screen
    gameHeader.classList.add("hidden");
    gameDescription.classList.add("hidden");
    startButton.classList.add("hidden");
    statsContainer.classList.add("hidden");
    gameOptions.classList.add("hidden");

    //Show game container
    gameContainer.classList.remove("hidden");

    gameContainer.innerHTML = `<lean-game options='${JSON.stringify(
      selectedOption
    )}'></lean-game>`;

    // document.querySelector("game-header").classList.add("hidden");
    // document.querySelector("game-description").classList.add("hidden");
    // document.querySelector("start-button").classList.add("hidden");
    // document.getElementById("stats-container").classList.add("hidden");
    // document.querySelector("game-options").classList.add("hidden");

    // document.getElementById("game-container").classList.remove("hidden");
    // document.getElementById(
    //   "game-container"
    // ).innerHTML = `<lean-game options='${JSON.stringify(
    //   selectedOption
    // )}'></lean-game>`;
  });

  //New round
  newRoundButton.addEventListener("newRound", (event) => {
    // Access the selected lean method from the event detail
    const selectedLeanMethod = selectedOption;

    // Hide home/stats screen
    gameHeader.classList.add("hidden");
    newRoundButton.classList.add("hidden");
    statsContainer.classList.add("hidden");
    gameOptions.classList.add("hidden");

    // Show game container
    gameContainer.classList.remove("hidden");
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

    // Hide game container
    gameContainer.classList.add("hidden");
    // Show statistics and reset home screen
    gameHeader.classList.remove("hidden");
    newRoundButton.classList.remove("hidden");
    statsContainer.classList.remove("hidden");
    gameOptions.classList.remove("hidden");
  });

  //Game end
  document.addEventListener("gameover", (event) => {
    const { gameStats, roundStats, capital } = event.detail;

    //update statistics
    const showStatsComponent = document.querySelector("show-stats");
    showStatsComponent.updateStatistics(gameStats, roundStats, capital);

    // Hide game container
    gameContainer.classList.add("hidden");
    // Show statistics and reset home screen
    gameHeader.classList.remove("hidden");
    gameDescription.classList.remove("hidden");
    startButton.classList.remove("hidden");
    statsContainer.classList.remove("hidden");
    gameOptions.classList.remove("hidden");
  });
});
