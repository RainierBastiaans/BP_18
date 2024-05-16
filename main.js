import "./game.js";

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("stats-container").innerHTML =
    "<show-stats></show-stats>";

  //Game start
  document.querySelector("start-button").addEventListener("startgame", () => {
    document.querySelector("game-header").classList.add("hidden");
    document.querySelector("game-description").classList.add("hidden");
    document.querySelector("start-button").classList.add("hidden");
    document.getElementById("game-container").classList.remove("hidden");
    document.getElementById("stats-container").classList.add("hidden");

    document.getElementById("game-container").innerHTML =
      "<lean-game></lean-game>";
  });

  //Game end
  document.addEventListener("gameover", (event) => {
    const score = event.detail.score;
    const showStatsComponent = document.querySelector("show-stats");
    showStatsComponent.updateScore(score);

    // Show statistics and reset home screen
    document.querySelector("game-header").classList.remove("hidden");
    document.querySelector("game-description").classList.remove("hidden");
    document.querySelector("start-button").classList.remove("hidden");
    document.getElementById("game-container").classList.add("hidden");
    document.getElementById("stats-container").classList.remove("hidden");
  });
});