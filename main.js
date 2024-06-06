import "./components/lean-game.js";
import "./components/game-header.js";
import "./components/game-description.js";
import "./components/start-button.js";
import "./components/show-stats.js";
import "./components/show-ingame-stats.js";
import "./components/game-options.js";
import { HighscoresDB } from "./db/highscores.js";
//COMPONENTS
import { HighscoreBoard } from "./components/highscore-board.js";
import { LeanGame } from "./components/lean-game.js";
import { GameOptions } from "./components/game-options.js";
import { ChooseLeanmethod } from "./components/choose-leanmethod.js";
import { StartButton } from "./components/start-button.js";
import { GameHeader } from "./components/game-header.js";
import { GameDescription } from "./components/game-description.js";
import { ShowStats } from "./components/show-stats.js";
import { ShowIngameStats } from "./components/show-ingame-stats.js";
import { NewRoundButton } from "./components/new-round-button.js";
import { ConfigGrid } from "./components/config-grid.js";

//MODELS
import { LeanMethodService } from "./lean-methods/lean-method-service.js";

//INITIALIZE COMPONENTS
let db = new HighscoresDB();
const leanGame = new LeanGame();
const leanMethodService = new LeanMethodService();
await leanMethodService.fetchLeanMethods();
const configGrid = new ConfigGrid();
const gameOptions = new GameOptions();
const startButton = new StartButton();
const gameHeader = new GameHeader();
const gameDescription = new GameDescription();
const showIngameStats = new ShowIngameStats();
const highscoreBoard = new HighscoreBoard(db); // Pass db instance
const roundSummary = new ChooseLeanmethod();
const newRoundButton = new NewRoundButton();
const showStats = new ShowStats();

//START VIEW

//GAME CONFIGURATION
const homePage = document.getElementById("home-page");
let selectedLeanMethod;
let selectedWorkstation;

//APPEND TO CONFIG PAGE
homePage.appendChild(gameHeader);
homePage.appendChild(configGrid);
configGrid.appendComponent(gameDescription);
configGrid.appendComponent(gameOptions);
configGrid.appendComponent(roundSummary);
configGrid.appendComponent(startButton);
configGrid.appendComponent(highscoreBoard);
configGrid.appendComponent(roundSummary);
configGrid.appendComponent(newRoundButton);

//GAME
const gameContainer = document.getElementById("game-container");
gameContainer.appendChild(leanGame);

//IN-GAME STATS
const ingameStatsContainer = document.getElementById("ingame-stats-container");
ingameStatsContainer.appendChild(showIngameStats);

//STATS
const statsContainer = document.getElementById("stats-container");
statsContainer.appendChild(showStats);

//EVENT LISTENERS
showStartView(); //Show the startView

gameOptions.addEventListener("workstationchange", (event) => {
  selectedWorkstation = parseInt(event.detail.workstation);
});

roundSummary.addEventListener("leanmethodchange", (event) => {
  selectedLeanMethod = event.detail.selectedLeanMethod;
});

// Game start
startButton.addEventListener("startgame", (event) => {
  const playerName = event.detail.playerName;
  showGameView();
  fetchParts().then((fetchedParts) => {
    leanGame.newGame(
      db,
      playerName,
      leanMethodService,
      fetchedParts,
      selectedWorkstation
    );
    leanGame.game.stats.addObserver(showStats);
    leanGame.game.stats.addObserver(showIngameStats);
  });
});
newRoundButton.addEventListener("newRound", (event) => {
  // Access the selected lean method from the event detail
  showGameView();
  leanGame.newRound(selectedLeanMethod);
});

//Round end
document.addEventListener("roundover", (event) => {
  const { gameStats, leanMethods } = event.detail;

  //update statistics
  showStats.update(gameStats);

  roundSummary.showLeanMethods(leanMethods);

  // Show statistics and reset home screen
  showRoundView();
});

//Game end
document.addEventListener("gameover", (event) => {
  const { gameStats } = event.detail;

  //update statistics
  showStats.update(gameStats);

  // Show statistics and reset home screen
  showEndGameView();
});

async function fetchParts() {
  try {
    const response = await fetch("./db/parts.json"); // Replace with your actual API endpoint
    if (!response.ok) {
      throw new Error(`Failed to fetch parts data: ${response.statusText}`);
    }
    const data = await response.json();
    return data.parts; // Assuming the API response has a "parts" property
  } catch (error) {
    console.error("Error fetching parts data:", error);
    // Handle the error here (e.g., set a default parts object)
  }
}

function showStartView() {
  roundSummary.hide();
  showStats.hide();
  showIngameStats.hide();
  leanGame.hide();
  newRoundButton.hide();
  gameHeader.show();
  gameDescription.show();
  gameOptions.show();
  startButton.show();
}

function showGameView() {
  gameHeader.hide();
  gameDescription.hide();
  startButton.hide();
  leanGame.show();
  showStats.hide();
  showIngameStats.show();
  gameOptions.hide();
  highscoreBoard.hide();
}

function showRoundView() {
  gameHeader.show();
  leanGame.hide();
  showStats.show();
  showIngameStats.hide();
  roundSummary.show();
  newRoundButton.show();
}

function showEndGameView() {
  gameHeader.show();
  gameDescription.show();
  startButton.show();
  leanGame.hide();
  showStats.show();
  showIngameStats.hide();
  gameOptions.show();
  highscoreBoard.show();
}
