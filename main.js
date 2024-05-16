import "./game.js";

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("start-button").addEventListener("startgame", () => {
    document.querySelector("game-header").classList.add("hidden");
    document.querySelector("game-description").classList.add("hidden");
    document.querySelector("start-button").classList.add("hidden");
    document.getElementById("game-container").classList.remove("hidden");

    // Here you can initialize your game logic
    document.getElementById("game-container").innerHTML =
      "<lean-game></lean-game>";

    // Here you can initialize your stats
    document.getElementById("stats-container").innerHTML =
      "<show-stats></show-stats>";
  });

  document.addEventListener("gameover", (event) => {
    const score = event.detail.score;

    // Update statistics
    const showStatsComponent = document.querySelector("show-stats");
    showStatsComponent.updateScore(score);

    // Show statistics and reset home screen
    gameContainer.classList.add("hidden");
    gameHeader.classList.remove("hidden");
    gameDescription.classList.remove("hidden");
    startButton.classList.remove("hidden");
    statisticsContainer.classList.remove("hidden");
  });
});
