import "./components/lean-game.js";
import "./components/game-header.js";
import "./components/game-description.js";
import "./components/start-button.js";
import "./components/show-stats.js";
import "./components/show-ingame-stats.js";
import "./components/game-options.js";
import { HighscoresDB } from "./db/highscores.js";
import { HighscoreBoard } from "./components/highscore-board.js";
import { LeanGame } from "./components/lean-game.js";
import { GameOptions } from "./components/game-options.js";
import { RoundSummary } from "./components/round-summary.js";
import { StartButton } from "./components/start-button.js";
import { GameHeader } from "./components/game-header.js";
import { GameDescription } from "./components/game-description.js";
import { ShowStats } from "./components/show-stats.js";
import { ShowIngameStats } from "./components/show-ingame-stats.js";
import { NewRoundButton } from "./components/new-round-button.js";
import { LeanMethodService } from "./lean-methods/lean-method-service.js";
import { ShopComponent } from "./components/shop-component.js";

let db = new HighscoresDB();

const leanGame = new LeanGame();
const leanMethodService = new LeanMethodService();
await leanMethodService.fetchLeanMethods();
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
const gameContainer = document.getElementById("game-container");
gameContainer.appendChild(leanGame);

let selectedLeanMethod;
let selectedWorkstation;

const homePage = document.getElementById("home-page");

const highscoreBoard = new HighscoreBoard(db); // Pass db instance

const gameOptions = new GameOptions();

const roundSummary = new RoundSummary();
const newRoundButton = new NewRoundButton();

const startButton = new StartButton();

const gameHeader = new GameHeader();

const gameDescription = new GameDescription();
fetchParts().then((fetchedParts) => {
  const shopComponent = new ShopComponent(fetchedParts);
  homePage.appendChild(shopComponent);
});

homePage.appendChild(gameHeader);
homePage.appendChild(gameDescription);
homePage.appendChild(gameOptions);
homePage.appendChild(roundSummary);
homePage.appendChild(startButton);
homePage.appendChild(highscoreBoard);
homePage.appendChild(roundSummary);
homePage.appendChild(newRoundButton);

const showStats = new ShowStats();

const statsContainer = document.getElementById("stats-container");

statsContainer.appendChild(showStats);

const showIngameStats = new ShowIngameStats();
const ingameStatsContainer = document.getElementById("ingame-stats-container");
ingameStatsContainer.appendChild(showIngameStats);

roundSummary.hide();
showStats.hide();
showIngameStats.hide();
leanGame.hide();
roundSummary.hide();
newRoundButton.hide();
gameOptions.addEventListener("workstationchange", (event) => {
  selectedWorkstation = parseInt(event.detail.workstation);
});

roundSummary.addEventListener("leanmethodchange", (event) => {
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
  gameHeader.hide();
  newRoundButton.hide();
  roundSummary.hide();
  showStats.hide();
  showIngameStats.show();
  leanGame.show();
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
  roundSummary.showLeanMethods(leanMethods);
  roundSummary.show();
  newRoundButton.show();
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
