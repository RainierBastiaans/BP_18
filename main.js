import GameFacade from "./model/gameFacade.js";
import StartController from "./controller/startController.js";
import { GameController } from "./controller/gameController.js";
import { RoundController } from "./controller/roundController.js";
import GameView from "./view/gameView.js";
import StartView from "./view/startView.js";
import EndView from "./view/endView.js";
import eventEmitter from "./eventEmitter.js";

const leanGame = document
  .getElementById("game-container")
  .querySelector("lean-game");

let selectedLeanMethod;
let selectedWorkstation;

document.addEventListener("DOMContentLoaded", (event) => {
  document
    .querySelector("game-options")
    .addEventListener("leanmethodchange", (event) => {
      selectedLeanMethod = event.detail.selectedLeanMethod;
    });

  const model = new GameFacade();
  const gameView = document.querySelector("game-view");
  const startView = document.querySelector("start-view");
  // const endView = new EndView();

  const startController = new StartController(model, startView);
  const gameController = new GameController(model, gameView);
  //const roundController = new RoundController(model, endView);

  eventEmitter.on("startgame", (event) => {
    console.log("startgame event received", event);
    startController.hide();
    gameController.init(selectedLeanMethod);
  });

  eventEmitter.on("newRound", (event) => {
    //roundController.newRound(event.detail.selectedLeanMethod);
  });

  eventEmitter.on("roundover", (event) => {
    //detail.roundStats?
    //gameController.handleRoundOver(event.detail);
  });

  eventEmitter.on("gameover", (event) => {
    //detail.gameStats?
    //gameController.handleGameOver(event.detail);
  });
  // setupGlobalEventListeners(startController, gameController);
});

// function setupGlobalEventListeners(startController, gameController) {
//   document.addEventListener("startgame", (event) => {
//     //should also be possible for "Play again" button to trigger this event with different options
//     console.log("startgame event received", event.detail);
//     gameController.init(event.detail);
//   });

//   document.addEventListener("newRound", (event) => {
//     //roundController.newRound(event.detail.selectedLeanMethod);
//   });

//   document.addEventListener("roundover", (event) => {
//     //detail.roundStats?
//     //gameController.handleRoundOver(event.detail);
//   });

//   document.addEventListener("gameover", (event) => {
//     //detail.gameStats?
//     //gameController.handleGameOver(event.detail);
//   });
// }
