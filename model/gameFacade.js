import Game from "./domain/game.js";
import Player from "./domain/player.js";
import Car from "./domain/car.js";
import Part from "./domain/part.js";
import Stock from "./domain/stock.js";
import Stats from "./domain/stats.js";
import Workstation from "./domain/workstation.js";

class GameFacade {
  constructor() {
    this.game = new Game();
    this.player = new Player();
    this.car = new Car();
    this.part = new Part();
    this.stock = new Stock();
    this.stats = new Stats();
    this.workstation = new Workstation();
  }

  configureGame(options) {}

  startGame() {}

  startNewRound() {}

  endRound() {}

  endGame() {}
}

export default GameFacade;
