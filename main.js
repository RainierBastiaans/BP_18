import GameFacade from "./model/gameFacade.js";
import StartController from "./controller/startController.js";
import { GameController } from "./controller/gameController.js";
import { RoundController } from "./controller/roundController.js";
import GameView from "./view/gameView.js";
import StartView from "./view/startView.js";
import EndView from "./view/endView.js";

document.addEventListener("DOMContentLoaded", (event) => {
  const model = new GameFacade();
  const gameView = document.querySelector('game-view')
  const startView = document.querySelector('start-view')
  // const endView = new EndView();

  const startController = new StartController(model, startView);
  const gameController = new GameController(model, gameView);
  //const roundController = new RoundController(model, endView);

  setupGlobalEventListeners(startController, gameController);
});

function setupGlobalEventListeners(startController, gameController) {
  document.addEventListener("startgame", (event) => {
    //should also be possible for "Play again" button to trigger this event with different options
    console.log("startgame event received");
    gameController.init(event.detail);
    startController.startGame(event.detail);
  });

  document.addEventListener("newRound", (event) => {
    //roundController.newRound(event.detail.selectedLeanMethod);
  });

  // document.addEventListener("roundover", (event) => {
  //   //detail.roundStats?
  //   gameController.handleRoundOver(event.detail);
  // });

  // document.addEventListener("gameover", (event) => {
  //   //detail.gameStats?
  //   gameController.handleGameOver(event.detail);
  // });
}
