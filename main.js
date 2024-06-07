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
import { ShopComponent } from "./components/shop-component.js";
import { PartsInStock } from "./components/parts-in-stock.js";

//MODELS
import { LeanMethodService } from "./lean-methods/lean-method-service.js";

/*======================
========GAME LOGIC======
======================*/
//START GAME
const leanGame = new LeanGame();
const gameContainer = document.getElementById("game-container");
gameContainer.appendChild(leanGame);

//INITIALIZE COMPONENTS
let db = new HighscoresDB();
const leanMethodService = new LeanMethodService();
await leanMethodService.fetchLeanMethods();
const configGrid = new ConfigGrid();
fetchParts().then((fetchedParts) => {
  leanGame.newGame(db, leanMethodService, fetchedParts);
  leanGame.game.stats.addObserver(showStats);
  leanGame.game.stats.addObserver(showIngameStats);
});

const gameOptions = new GameOptions();
const playerNameInput = new PlayerName(leanMethodService.getAllLeanMethods());
const startButton = new StartButton(playerNameInput.playerName);
const gameHeader = new GameHeader();
const gameDescription = new GameDescription();
const showIngameStats = new ShowIngameStats();
const highscoreBoard = new HighscoreBoard(db); // Pass db instance
const chooseLeanMethod = new ChooseLeanmethod();
const newRoundButton = new NewRoundButton();
const showStats = new ShowStats();
const partsInStock = new PartsInStock();
const fixedCosts = document.createElement("fixed-costs");
const kapitaal = document.createElement("kapitaal");

//START VIEW

//GAME CONFIGURATION
const homePage = document.getElementById("home-page");
let selectedLeanMethod;
let selectedWorkstation;
let shopComponent;

//APPEND TO HOME PAGE
homePage.appendChild(gameHeader);
homePage.appendChild(configGrid);
homePage.appendChild(chooseLeanMethod);
homePage.appendChild(highscoreBoard);
homePage.appendChild(newRoundButton);
//BUILD COLUMNS
//BUILD COLUMN 1
configGrid.appendColumn(1, playerNameInput);
configGrid.appendColumn(1, kapitaal);
//NEEDS TO BE FILLED WITH DATA
configGrid.appendColumn(1, partsInStock);
configGrid.appendColumn(1, fixedCosts);

//BUILD COLUMN 2
configGrid.appendColumn(2, gameDescription);
fetchParts().then((fetchedParts) => {
  shopComponent = new ShopComponent(fetchedParts);
  configGrid.appendColumn(2, shopComponent);
  shopComponent.addEventListener("buy-parts", (event) => {
    const boughtParts = event.detail.parts;
    leanGame.game.buyStock(boughtParts);
    // partsInStock.update(
    //   leanGame.game.workstations.get(selectedWorkstation).partnames
    // );
  });
  configGrid.appendColumn(2, startButton);
});

//BUILD COLUMN 3
configGrid.appendColumn(3, gameOptions);

//IN-GAME STATS
const ingameStatsContainer = document.getElementById("ingame-stats-container");
ingameStatsContainer.appendChild(showIngameStats);

//STATS
const statsContainer = document.getElementById("stats-container");
statsContainer.appendChild(showStats);

chooseLeanMethod.hide();
showStats.hide();
leanGame.hide();
newRoundButton.hide();
highscoreBoard.hide();
showIngameStats.hide();

//EVENT LISTENERS
gameOptions.addEventListener("workstationchange", (event) => {
  selectedWorkstation = parseInt(event.detail.workstation);
});

chooseLeanMethod.addEventListener("leanmethodchange", (event) => {
  selectedLeanMethod = event.detail.selectedLeanMethod;
});

// Game start
startButton.addEventListener("startgame", (event) => {
  const playerName = event.detail.playerName;
  gameHeader.hide();
  gameDescription.hide();
  startButton.hide();
  leanGame.show();
  showStats.hide();
  showIngameStats.show();
  gameOptions.hide();
  highscoreBoard.hide();
  shopComponent.hide();
  leanGame.startGame(playerName, selectedWorkstation);
});

newRoundButton.addEventListener("newRound", (event) => {
  // Access the selected lean method from the event detail
  gameHeader.hide();
  newRoundButton.hide();
  chooseLeanMethod.hide();
  showStats.hide();
  showIngameStats.show();
  leanGame.show();
  shopComponent.hide();
  leanGame.newRound(selectedLeanMethod);
});

//Round end
document.addEventListener("roundover", (event) => {
  const { gameStats, leanMethods } = event.detail;

  //update statistics
  showStats.update(gameStats);

  // Show statistics and reset home screen
  gameHeader.show();
  leanGame.hide();
  showStats.show();
  showIngameStats.hide();
  chooseLeanMethod.showLeanMethods(leanMethods);
  chooseLeanMethod.show();
  newRoundButton.show();
  shopComponent.show();
});

//Game end
document.addEventListener("gameover", (event) => {
  const { gameStats } = event.detail;

  //update statistics
  showStats.update(gameStats);

  // Show statistics and reset home screen
  gameHeader.show();
  gameDescription.show();
  startButton.show();
  leanGame.hide();
  showStats.show();
  showIngameStats.hide();
  gameOptions.show();
  highscoreBoard.show();
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
