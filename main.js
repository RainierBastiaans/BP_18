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
  });
});
