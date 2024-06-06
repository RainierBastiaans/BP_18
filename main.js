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
import { PlayerName } from "./components/player-name.js";

//MODELS
import { LeanMethodService } from "./lean-methods/lean-method-service.js";

//INITIALIZE COMPONENTS
let db = new HighscoresDB();
const leanGame = new LeanGame();
const leanMethodService = new LeanMethodService();
await leanMethodService.fetchLeanMethods();
const configGrid = new ConfigGrid();
const gameOptions = new GameOptions();
const playerNameInput = new PlayerName();
const startButton = new StartButton(playerNameInput.playerName);
const gameHeader = new GameHeader();
const gameDescription = new GameDescription();
const showIngameStats = new ShowIngameStats();
const highscoreBoard = new HighscoreBoard(db); // Pass db instance
const chooseLeanMethod = new ChooseLeanmethod();
const newRoundButton = new NewRoundButton();
const showStats = new ShowStats();

//START VIEW

//GAME CONFIGURATION
const homePage = document.getElementById("home-page");
let selectedLeanMethod;
let selectedWorkstation;

//APPEND TO HOME PAGE
homePage.appendChild(gameHeader);
homePage.appendChild(configGrid);
homePage.appendChild(chooseLeanMethod);
homePage.appendChild(highscoreBoard);
homePage.appendChild(newRoundButton);
//BUILD COLUMNS
//BUILD COLUMN 1
configGrid.appendColumn(1, playerNameInput);

//BUILD COLUMN 2
configGrid.appendColumn(2, gameDescription);
configGrid.appendColumn(2, startButton);

//BUILD COLUMN 3
configGrid.appendColumn(3, gameOptions);

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

chooseLeanMethod.addEventListener("leanmethodchange", (event) => {
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

  chooseLeanMethod.showLeanMethods(leanMethods);

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
  chooseLeanMethod.hide();
  showStats.hide();
  showIngameStats.hide();
  leanGame.hide();
  newRoundButton.hide();
  highscoreBoard.hide();
  gameHeader.show();
  gameDescription.show();
  gameOptions.show();
  startButton.show();
}

function showGameView() {
  homePage.classList.add("hidden");
  configGrid.hide();
  gameHeader.hide();
  gameDescription.hide();
  startButton.hide();
  gameOptions.hide();
  highscoreBoard.hide();
  showStats.hide();
  leanGame.show();
  showIngameStats.show();
}

function showRoundView() {
  gameHeader.show();
  leanGame.hide();
  showStats.show();
  showIngameStats.hide();
  chooseLeanMethod.show();
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
