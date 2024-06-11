import "./components/gameplay/lean-game.js";
import "./components/game-header.js";
import "./components/start-screen/game-description-container.js";
import "./components/configure-game/start-button.js";
import "./components/show-stats.js";
import "./components/show-ingame-stats.js";
import "./components/configure-game/select-workstation.js";
import { HighscoresDB } from "./db/highscores.js";
// COMPONENTS
import { HighscoreBoard } from "./components/start-screen/highscore-board.js";
import { LeanGame } from "./components/gameplay/lean-game.js";
import { SelectWorkstation } from "./components/configure-game/select-workstation.js";
import { ChooseLeanmethod } from "./components/configure-game/choose-leanmethod.js";
import { StartButton } from "./components/configure-game/start-button.js";
import { GameHeader } from "./components/game-header.js";
import { GameDescriptionContainer } from "./components/start-screen/game-description-container.js";
import { ShowStats } from "./components/show-stats.js";
import { ShowIngameStats } from "./components/show-ingame-stats.js";
import { NewRoundButton } from "./components/configure-game/new-round-button.js";
import { ConfigGrid } from "./components/configure-game/config-grid.js";
import { PlayerName } from "./components/configure-game/player-name.js";
import { ShopComponent } from "./components/configure-game/shop-component.js";
import { PersonalStock } from "./components/configure-game/personal-stock.js";
import { LiveStock } from "./components/gameplay/live-stock.js";
import { FixedCosts } from "./components/configure-game/fixed-costs.js";
import { PlayersOverview } from "./components/configure-game/players-overview.js";

// MODELS
import { LeanMethodService } from "./lean-methods/lean-method-service.js";
import { LetsGetStartButton } from "./components/start-screen/lets-get-started-button.js";
import { StartGrid } from "./components/start-screen/start-grid.js";


// Global error handler
window.onerror = function(message, source, lineno, colno, error) {
  alert('x')
  console.error(`Error occurred: ${message}\nAt ${source}:${lineno}:${colno}`);
  if (error) {
    console.error(`Error object: ${error}`);
  }
}

// INITIALIZE COMPONENTS
const leanGame = new LeanGame();
const db = new HighscoresDB();
const leanMethodService = new LeanMethodService();
await leanMethodService.fetchLeanMethods();
const startGrid = new StartGrid();
const configGrid = new ConfigGrid();
const showIngameStats = new ShowIngameStats();
const showStats = new ShowStats();
const highscoreBoard = new HighscoreBoard(db); // Pass db instance
const chooseLeanMethod = new ChooseLeanmethod();
const selectWorkstationComponent = new SelectWorkstation();
const playerNameInput = new PlayerName();
const startButton = new StartButton();
const gameHeader = new GameHeader();
const gameDescriptionComponent = new GameDescriptionContainer();
const newRoundButton = new NewRoundButton();
const letsgetstartButton = new LetsGetStartButton();
const homePage = document.getElementById("home-page");
const startPage = document.getElementById("start-page");
const gameContainer = document.getElementById("game-container");
const liveContainer = document.getElementById("live");
const ingameStatsContainer = document.getElementById("ingame-stats-container");
const liveStockContainer = document.getElementById("live-stock-container");
const statsContainer = document.getElementById("stats-container");

let selectedLeanMethod;
let selectedWorkstation;
let shopComponent;
let liveStockComponent;
let fixedCosts;

// Normally this would be fetched from the database
let otherPlayers = [
  { name: "OG Bot 2", workstation: 2 },
  { name: "Bender bot 3", workstation: 3 },
  { name: "Butter bot 4", workstation: 4 },
  { name: "i-Robot 5", workstation: 5 },
];

const playersOverview = new PlayersOverview(otherPlayers);

// FETCH PARTS AND INITIALIZE GAME
await fetchParts().then((fetchedParts) => {
  leanGame.newGame(db, leanMethodService, fetchedParts);
  leanGame.game.stats.addObserver(showStats);
  leanGame.game.stats.addObserver(showIngameStats);
  liveStockComponent = new LiveStock(fetchedParts);
  leanGame.game.stock.addObserver(liveStockComponent);
  fixedCosts = new FixedCosts(leanGame.game.getFixedCosts());
  initShop(fetchedParts);
});

// BUILD INITIAL CONFIGURATION SCREEN
buildScreens();
showStartScreen();

// EVENT LISTENERS
selectWorkstationComponent.addEventListener("workstationchange", (event) => {
  const oldSelectedWorkstation = selectedWorkstation || 1;
  selectedWorkstation = parseInt(event.detail.workstation) || 1;
  updatePlayerWorkstations(oldSelectedWorkstation, selectedWorkstation);
  playersOverview.update(otherPlayers);
});

chooseLeanMethod.addEventListener("leanmethodchange", (event) => {
  selectedLeanMethod = event.detail.selectedLeanMethod;
});

startButton.addEventListener("startgame", (event) => {
  startGame(event.detail.playerName);
});

newRoundButton.addEventListener("newRound", () => {
  startNewRound();
});

document.addEventListener("roundover", (event) => {
  const { gameStats, leanMethods } = event.detail;
  endRound(gameStats, leanMethods);
});

document.addEventListener("gameover", (event) => {
  const { gameStats } = event.detail;
  endGame(gameStats);
});
document.addEventListener("showConfigScreen", () => {
  showConfigScreen();
});

// FUNCTION DEFINITIONS

function buildScreens() {
  //start

  startGrid.appendColumn(1, gameDescriptionComponent);
  startGrid.appendColumn(2, highscoreBoard);
  startGrid.appendColumn(3, letsgetstartButton);
  startPage.appendChild(startGrid);

  homePage.appendChild(configGrid);
  homePage.appendChild(chooseLeanMethod);
  homePage.appendChild(newRoundButton);

  configGrid.appendColumn(1, playerNameInput);
  configGrid.appendColumn(1, fixedCosts);
  configGrid.appendColumn(2, shopComponent);
  configGrid.appendColumn(2, startButton);
  configGrid.appendColumn(2, newRoundButton);
  configGrid.appendColumn(3, chooseLeanMethod);
  configGrid.appendColumn(3, selectWorkstationComponent);
  configGrid.appendColumn(3, playersOverview);

  ingameStatsContainer.appendChild(showIngameStats);
  liveStockContainer.appendChild(liveStockComponent);
  statsContainer.appendChild(showStats);

  //game
  gameContainer.appendChild(leanGame);
}

function initShop(fetchedParts) {
  let personalStockComponent = new PersonalStock(fetchedParts);
  leanGame.game.stock.addObserver(personalStockComponent);
  shopComponent = new ShopComponent(fetchedParts, personalStockComponent);
  shopComponent.addEventListener("buy-parts", (event) => {
    const boughtParts = event.detail.parts;
    leanGame.game.buyStock(boughtParts);
  });
}

function showConfigScreen() {
  homePage.classList.remove("hidden");
  configGrid.show();
  gameHeader.hide();
  gameDescriptionComponent.hide();
  startButton.show();
  selectWorkstationComponent.show();
  highscoreBoard.hide();
  shopComponent.show();
  playerNameInput.show();
  fixedCosts.show();
  playersOverview.show();
  newRoundButton.show();
  showStats.hide();
  showIngameStats.hide();
  leanGame.hide();
  newRoundButton.hide();
  chooseLeanMethod.hide();
  liveStockComponent.hide();
  letsgetstartButton.hide();
  startGrid.classList.add("hidden");
}

function showGameScreen() {
  gameContainer.classList.remove("hidden");
  homePage.classList.add("hidden");
  leanGame.show();
  showIngameStats.show();
  playerNameInput.hide();
  configGrid.hide();
  gameHeader.hide();
  gameDescriptionComponent.hide();
  startButton.hide();
  selectWorkstationComponent.hide();
  highscoreBoard.hide();
  shopComponent.hide();
  fixedCosts.hide();
  playersOverview.hide();
  newRoundButton.hide();
  showStats.hide();
  chooseLeanMethod.hide();
  liveStockComponent.show();
}

function showRoundScreen() {
  homePage.classList.remove("hidden");
  leanGame.hide();
  showIngameStats.hide();
  playerNameInput.hide();
  configGrid.show();
  gameHeader.hide();
  gameDescriptionComponent.hide();
  startButton.hide();
  selectWorkstationComponent.hide();
  highscoreBoard.hide();
  shopComponent.show();
  fixedCosts.show();
  playersOverview.hide();
  newRoundButton.show();
  showStats.show();
  chooseLeanMethod.show();
  liveStockComponent.hide();
}

function showEndGameScreen() {
  showStats.show();
  highscoreBoard.show()
  letsgetstartButton.show()
  gameContainer.classList.add("hidden")
  liveContainer.classList.add("hidden")
  startGrid.classList.remove("hidden")
}

function showStartScreen() {
  homePage.classList.add("hidden");
  gameHeader.show();
  gameDescriptionComponent.show();
  highscoreBoard.show();
  configGrid.hide();
  startButton.hide();
  selectWorkstationComponent.hide();
  shopComponent.hide();
  playerNameInput.hide();
  fixedCosts.hide();
  playersOverview.hide();
  newRoundButton.hide();
  showStats.hide();
  showIngameStats.hide();
  leanGame.hide();
  newRoundButton.hide();
  chooseLeanMethod.hide();
  liveStockComponent.hide();
  letsgetstartButton.show();
  leanGame.hide();
  gameContainer.classList.add("hidden");
}

function startGame(playerName) {
  showGameScreen();
  leanGame.startGame(playerName, selectedWorkstation, otherPlayers);
}

function startNewRound() {
  showGameScreen();
  leanGame.newRound(selectedLeanMethod);
}

function endRound(gameStats, leanMethods) {
  showRoundScreen();
  chooseLeanMethod.showLeanMethods(leanMethods);
  showStats.update(gameStats);
}

function endGame(gameStats) {
  showEndGameScreen();
  showStats.update(gameStats);
}

function updatePlayerWorkstations(oldSelectedWorkstation, selectedWorkstation) {
  otherPlayers.forEach((player) => {
    if (player.workstation === selectedWorkstation) {
      player.workstation = oldSelectedWorkstation;
    }
  });
  playersOverview.update(otherPlayers);
}

//EVENT LISTENERS
chooseLeanMethod.addEventListener("leanmethodchange", (event) => {
  selectedLeanMethod = event.detail.selectedLeanMethod;
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
