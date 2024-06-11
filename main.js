import "./components/gameplay/lean-game.js";
import "./components/game-header.js";
import "./components/configure-game/game-description-container.js";
import "./components/configure-game/start-button.js";
import "./components/show-stats.js";
import "./components/show-ingame-stats.js";
import "./components/configure-game/select-workstation.js";
import { HighscoresDB } from "./db/highscores.js";
//COMPONENTS
import { HighscoreBoard } from "./components/highscore-board.js";
import { LeanGame } from "./components/gameplay/lean-game.js";
import { SelectWorkstation } from "./components/configure-game/select-workstation.js";
import { ChooseLeanmethod } from "./components/configure-game/choose-leanmethod.js";
import { StartButton } from "./components/configure-game/start-button.js";
import { GameHeader } from "./components/game-header.js";
import { GameDescriptionContainer } from "./components/configure-game/game-description-container.js";
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

//MODELS
import { LeanMethodService } from "./lean-methods/lean-method-service.js";

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
//Normally this would be fetched from the database
let otherPlayers = [
  { name: "OG Bot 2", workstation: 2 },
  { name: "Bender bot 3", workstation: 3 },
  { name: "Butter bot 4", workstation: 4 },
  { name: "i-Robot 5", workstation: 5 },
];
let liveStockComponent;
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
  leanGame.game.stock.addObserver(liveStockComponent);
});

const selectWorkstationComponent = new SelectWorkstation();
const playerNameInput = new PlayerName();
const startButton = new StartButton();
const gameHeader = new GameHeader();
const gameDescriptionComponent = new GameDescriptionContainer();
const highscoreBoard = new HighscoreBoard(db); // Pass db instance
const chooseLeanMethod = new ChooseLeanmethod();
const newRoundButton = new NewRoundButton();
const fixedCosts = new FixedCosts(leanGame.game.getFixedCosts());
//const capital = new Capital(leanGame.game.stats.capital);
const kapitaal = document.createElement("kapitaal");
const playersOverview = new PlayersOverview(otherPlayers);

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

selectWorkstationComponent.addEventListener("workstationchange", (event) => {
  const oldSelectedWorkstation = selectedWorkstation || 1;
  console.log(oldSelectedWorkstation);
  console.log(event.detail.workstation);
  // Update selected workstation
  selectedWorkstation = parseInt(event.detail.workstation) || 1;

  // update bots
  otherPlayers.forEach((player) => {
    if (player.workstation === selectedWorkstation) {
      player.workstation = oldSelectedWorkstation;
    }
  });
  playersOverview.update(otherPlayers);
});

//BUILD COLUMNS
//BUILD COLUMN 1
configGrid.appendColumn(1, playerNameInput);
//configGrid.appendColumn(1, kapitaal);
configGrid.appendColumn(1, fixedCosts);

//BUILD COLUMN 2
configGrid.appendColumn(2, gameDescriptionComponent);
await fetchParts().then((fetchedParts) => {
  let personalStockComponent = new PersonalStock(fetchedParts);
  leanGame.game.stock.addObserver(personalStockComponent);
  shopComponent = new ShopComponent(fetchedParts, personalStockComponent);
  configGrid.appendColumn(2, shopComponent);
  shopComponent.addEventListener("buy-parts", (event) => {
    const boughtParts = event.detail.parts;
    leanGame.game.buyStock(boughtParts);
  });
  configGrid.appendColumn(2, startButton);
  configGrid.appendColumn(2, newRoundButton);
});

//BUILD COLUMN 3
configGrid.appendColumn(3, chooseLeanMethod);
configGrid.appendColumn(3, selectWorkstationComponent);
configGrid.appendColumn(3, playersOverview);

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
showIngameStats.hide();
gameContainer.classList.add("hidden");
leanGame.hide();
newRoundButton.hide();
liveStockComponent.hide();

//EVENT LISTENERS
chooseLeanMethod.addEventListener("leanmethodchange", (event) => {
  selectedLeanMethod = event.detail.selectedLeanMethod;
});

// Game start
startButton.addEventListener("startgame", (event) => {
  console.log("Game started with player name:", event.detail.playerName);
  const playerName = event.detail.playerName.value;

  //HIDE
  homePage.classList.add("hidden");
  homePage.classList.add("hidden");
  configGrid.hide();
  gameHeader.hide();
  gameDescriptionComponent.hide();
  startButton.hide();
  showStats.hide();
  selectWorkstationComponent.hide();
  highscoreBoard.hide();
  shopComponent.hide();
  playerNameInput.hide();
  fixedCosts.hide();
  playersOverview.hide();

  //SHOW
  gameContainer.classList.remove("hidden");
  leanGame.show();
  showIngameStats.show();

  // Start the game
  leanGame.startGame(playerName, selectedWorkstation, otherPlayers);
});

newRoundButton.addEventListener("newRound", (event) => {
  //HIDE
  homePage.classList.add("hidden");
  homePage.classList.add("hidden");
  configGrid.hide();
  gameHeader.hide();
  newRoundButton.hide();
  chooseLeanMethod.hide();
  showStats.hide();
  shopComponent.hide();

  //SHOW
  showIngameStats.show();
  gameContainer.classList.remove("hidden");
  leanGame.show();

  // Start new round
  leanGame.newRound(selectedLeanMethod);
});

//Round end
document.addEventListener("roundover", (event) => {
  const { gameStats, leanMethods } = event.detail;

  //HIDE
  gameContainer.classList.add("hidden");
  leanGame.hide();
  showIngameStats.hide();
  leanGame.hide();

  //SHOW
  homePage.classList.remove("hidden");
  homePage.classList.remove("hidden");
  configGrid.show();
  gameHeader.show();
  showStats.show();
  chooseLeanMethod.showLeanMethods(leanMethods);
  chooseLeanMethod.show();
  newRoundButton.show();
  shopComponent.show();
  playerNameInput.show();
  fixedCosts.show();
  playersOverview.show();

  //update statistics
  showStats.update(gameStats);
});

//Game end
document.addEventListener("gameover", (event) => {
  const { gameStats } = event.detail;

  //HIDE
  gameContainer.classList.add("hidden");
  leanGame.hide();
  showStats.show();
  showIngameStats.hide();

  //update statistics
  showStats.update(gameStats);

  //SHOW
  homePage.classList.remove("hidden");
  homePage.classList.remove("hidden");
  configGrid.show();
  gameHeader.show();
  gameDescriptionComponent.show();
  startButton.show();
  selectWorkstationComponent.show();
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
