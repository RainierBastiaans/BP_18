import "./components/lean-game.js";
import "./components/game-header.js";
import "./components/game-description-container.js";
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
import { GameDescriptionContainer } from "./components/game-description-container.js";
import { ShowStats } from "./components/show-stats.js";
import { ShowIngameStats } from "./components/show-ingame-stats.js";
import { NewRoundButton } from "./components/new-round-button.js";
import { ConfigGrid } from "./components/config-grid.js";
import { PlayerName } from "./components/player-name.js";
import { ShopComponent } from "./components/shop-component.js";
import { PersonalStock } from "./components/personal-stock.js";

//MODELS
import { LeanMethodService } from "./lean-methods/lean-method-service.js";
import { LiveStock } from "./components/live-stock.js";

/*======================
========GAME LOGIC======
======================*/
//START GAME
const leanGame = new LeanGame();
const gameContainer = document.getElementById("game-container");
gameContainer.appendChild(leanGame);

//GET LIVE STOCK COMPONENT
const liveContainer = document.getElementById("live");

//INITIALIZE COMPONENTS
let db = new HighscoresDB();
let liveStockComponent;
let personalStockComponent;
const leanMethodService = new LeanMethodService();
await leanMethodService.fetchLeanMethods();
const configGrid = new ConfigGrid();
const showIngameStats = new ShowIngameStats();
const showStats = new ShowStats();

await fetchParts().then((fetchedParts) => {
  leanGame.newGame(db, leanMethodService, fetchedParts);
  leanGame.game.stats.addObserver(showStats);
  leanGame.game.stats.addObserver(showIngameStats);
  liveStockComponent = new LiveStock(fetchedParts);
  personalStockComponent = new PersonalStock(fetchedParts);
  leanGame.game.stock.addObserver(liveStockComponent);
});

const gameOptions = new GameOptions();
const playerNameInput = new PlayerName(leanMethodService.getAllLeanMethods());
const startButton = new StartButton(playerNameInput.playerName);
const gameHeader = new GameHeader();
const gameDescriptionComponent = new GameDescriptionContainer();
const highscoreBoard = new HighscoreBoard(db); // Pass db instance
const chooseLeanMethod = new ChooseLeanmethod();
const newRoundButton = new NewRoundButton();
const fixedCosts = document.createElement("fixed-costs");
const kapitaal = document.createElement("kapitaal");

//START VIEW

//GAME CONFIGURATION
const homePage = document.getElementById("home-page");
let selectedLeanMethod;
let selectedWorkstation;
let shopComponent;

//APPEND TO HOME PAGE
// homePage.appendChild(gameHeader);
homePage.appendChild(configGrid);
homePage.appendChild(chooseLeanMethod);
homePage.appendChild(highscoreBoard);
homePage.appendChild(newRoundButton);

gameOptions.addEventListener("workstationchange", (event) => {
  selectedWorkstation = parseInt(event.detail.workstation) || 1;
});

//BUILD COLUMNS
//BUILD COLUMN 1
configGrid.appendColumn(1, playerNameInput);
configGrid.appendColumn(1, kapitaal);
//NEEDS TO BE FILLED WITH DATA
configGrid.appendColumn(1, personalStockComponent);
configGrid.appendColumn(1, fixedCosts);

//BUILD COLUMN 2
configGrid.appendColumn(2, gameDescriptionComponent);
fetchParts().then((fetchedParts) => {
  shopComponent = new ShopComponent(fetchedParts);
  configGrid.appendColumn(2, shopComponent);
  shopComponent.addEventListener("buy-parts", (event) => {
    const boughtParts = event.detail.parts;
    leanGame.game.buyStock(boughtParts);
  });
  configGrid.appendColumn(2, startButton);
});

//BUILD COLUMN 3
configGrid.appendColumn(3, gameOptions);

//IN-GAME STATS
const ingameStatsContainer = document.getElementById("ingame-stats-container");
ingameStatsContainer.appendChild(showIngameStats);

const liveStockContainer = document.getElementById("live-stock-container");
liveStockContainer.appendChild(liveStockComponent);

//STATS
const statsContainer = document.getElementById("stats-container");
statsContainer.appendChild(showStats);

//HIDE ALL COMPONENTS
liveContainer.classList.add("hidden");
gameContainer.classList.add("hidden");
chooseLeanMethod.hide();
showStats.hide();
leanGame.hide();
newRoundButton.hide();
highscoreBoard.hide();
showIngameStats.hide();
liveStockComponent.hide();

//EVENT LISTENERS
chooseLeanMethod.addEventListener("leanmethodchange", (event) => {
  selectedLeanMethod = event.detail.selectedLeanMethod;
});

// Game start
startButton.addEventListener("startgame", (event) => {
  const playerName = event.detail.playerName;
  gameContainer.classList.remove("hidden");
  gameHeader.hide();
  gameDescriptionComponent.hide();
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
  gameDescriptionComponent.show();
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
