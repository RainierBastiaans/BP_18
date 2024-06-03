import "./components/lean-game.js";
import "./components/game-header.js";
import "./components/game-description.js";
import "./components/start-button.js";
import "./components/show-stats.js";
import "./components/game-options.js";
import { HighscoresDB } from "./db/highscores.js";
import { HighscoreBoard } from "./components/highscore-board.js";
import { LeanGame } from "./components/lean-game.js";

let db = new HighscoresDB();

const leanGame = new LeanGame();
document.getElementById("game-container").appendChild(leanGame);

let selectedLeanMethod; // To store selected options
let selectedWorkstation;

const highscoreBoard = new HighscoreBoard(db); // Pass db instance

document.getElementById("home-page").appendChild(highscoreBoard);

document.addEventListener("DOMContentLoaded", () => {
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
    const playerName = event.detail.playerName;
    document.querySelector("game-header").classList.add("hidden");
    document.querySelector("game-description").classList.add("hidden");
    document.querySelector("start-button").classList.add("hidden");
    document.getElementById("game-container").classList.remove("hidden");
    document.getElementById("stats-container").classList.remove("hidden");
    document.querySelector("game-options").classList.add("hidden");
    highscoreBoard.hide()
    leanGame.newGame(db, playerName, selectedWorkstation);
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
    const { gameStats, leanMethods } = event.detail;

    //update statistics
    const showStatsComponent = document.querySelector("show-stats");
    showStatsComponent.update(gameStats);

    // Show statistics and reset home screen
    document.querySelector("game-header").classList.remove("hidden");
    document.querySelector("new-round-button").classList.remove("hidden");
    document.getElementById("game-container").classList.add("hidden");
    document.getElementById("stats-container").classList.remove("hidden");
    const roundsummaryElement = document.querySelector("round-summary");
    roundsummaryElement.showLeanMethods(leanMethods);
    roundsummaryElement.classList.remove("hidden");
  });

  // //Game end
  // leanGame.emitter.on("gameOver", (data) => {
  //   console.log("x");
  //   const { gameStats } = data;

  //   //update statistics
  //   const showStatsComponent = document.querySelector("show-stats");
  //   showStatsComponent.update(gameStats);

  //   // Show statistics and reset home screen
  //   document.querySelector("game-header").classList.remove("hidden");
  //   document.querySelector("game-description").classList.remove("hidden");
  //   document.querySelector("start-button").classList.remove("hidden");
  //   document.getElementById("game-container").classList.add("hidden");
  //   document.getElementById("stats-container").classList.remove("hidden");
  //   document.querySelector("game-options").classList.remove("hidden");
  // });
  document.addEventListener("gameover", (event) => {
    const { gameStats } = event.detail;

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
    highscoreBoard.show()
  });
});
