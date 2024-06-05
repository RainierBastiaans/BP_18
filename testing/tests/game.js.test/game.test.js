import { Game } from "../../../Models/game.js";
import { GameStats } from "../../../Models/stats/game-stats.js";
import { Stock } from "../../../Models/stock/stock.js";
import { HighscoresDB } from "../../../db/highscores.js";
import { LeanMethodService } from "../../../lean-methods/lean-method-service.js";


jest.mock("../../../db/highscores.js"); // Mock HighScoresDB dependency
jest.mock("../../../lean-methods/lean-method-service.js");
jest.mock("../../../Models/stats/game-stats.js"); // Mock GameStats dependency (optional)
jest.mock("../../../Models/stock/stock.js"); // Mock Stock dependency (optional)
jest.mock("../../../Models/occupant/bot.js"); // Mock Bot dependency (optional)

export const parts = [
  {
      "name": "chassis",
      "price": 1000.99
  },
  {
      "name": "hood",
      "price": 55.55
  },
  {
      "name": "trunk",
      "price": 33.33
  },
  {
      "name": "door",
      "price": 22.22
  },
  {
      "name": "engineBlock",
      "price": 500.50
  },
  {
      "name": "cylinderHead",
      "price": 49.99
  },
  {
      "name": "piston",
      "price": 120.22
  },
  {
      "name": "sparkPlugs",
      "price": 99.99
  },
  {
      "name": "dashboard",
      "price": 299.99
  },
  {
      "name": "steeringWheel",
      "price": 69.69
  },
  {
      "name": "seat",
      "price": 5.99
  },
  {
      "name": "carpet",
      "price": 50.01
  },
  {
      "name": "battery",
      "price": 121.11
  },
  {
      "name": "alternator",
      "price": 130.00
  },
  {
      "name": "wiringHarness",
      "price": 169.20
  },
  {
      "name": "headlights",
      "price": 44.44
  },
  {
      "name": "brakePads",
      "price": 666.66
  },
  {
      "name": "wheel",
      "price": 99.00
  },
  {
      "name": "tire",
      "price": 1.00
  },
  {
      "name": "hubcap",
      "price": 0.69
  }
]

describe("Game", () => {
  let game;

  beforeEach(() => {
    game = new Game(new HighscoresDB(), new LeanMethodService(), parts);
  });

  // Positive Tests

  test("constructor initializes game state correctly", () => {
    expect(game.db instanceof HighscoresDB).toBe(true);
    expect(game.leanMethodService instanceof LeanMethodService).toBe(true);
    expect(game.isOver).toBe(false); // Check isOver is false
    expect(game.carId).toBe(1); // Check carId is 1 (adjust if different)
  });

  // Error Handling Tests

  test("constructor throws error if HighScoresDB is missing", () => {
    expect(() => new Game(null, new LeanMethodService(), null)).toThrow(Error);
    expect(() => new Game(undefined, new LeanMethodService(), null)).toThrow(Error);
  });

  test("constructor throws error for invalid LeanMethodService type", () => {
    expect(() => new Game(new HighscoresDB(), {}, null)).toThrow(Error); // Or a more specific error type
  });




  //NewGame Method
  // Positive Test: Valid Input

  test("newGame initializes game state and objects (valid input)", () => {
    game.newGame(2, "John Doe");

    expect(game.playerName).toBe("John Doe");
    expect(game.selectedWorkstation).toBe(2);
    expect(game.stats instanceof GameStats).toBe(true); // Assuming mocked GameStats
    expect(game.stock instanceof Stock).toBe(true); // Assuming mocked Stock
    expect(game.bots.length).toBe(4); // Assuming 4 bots created for non-selected workstations
  });

  // Negative Tests: Validation and Error Handling

  test("newGame throws error for invalid player name (too short)", () => {
    expect(() => game.newGame("AB", 1)).toThrow(Error);
    expect(() => game.newGame("", 1)).toThrow(Error);
  });

  test("newGame throws error for invalid selected workstation (non-integer)", () => {
    expect(() => game.newGame("John", "three")).toThrow(Error);
    expect(() => game.newGame("John", 3.14)).toThrow(Error);
  });

  test("newGame throws error for selected workstation out of range", () => {
    expect(() => game.newGame("John", 0)).toThrow(Error);
    expect(() => game.newGame("John", 6)).toThrow(Error);
  });

  // //newRound
  

  // test("newRound initializes new round and updates game state (valid input)", () => {
  //   game.newGame(2, "John Doe");
  //   const initialRoundsSize = game.rounds.size;

  //   game.newRound('total-quality-control'); // Replace with actual leanMethod

  //   expect(game.rounds.size).toBe(initialRoundsSize + 1);
  //   expect(game.rounds.get(initialRoundsSize + 1) instanceof Round).toBe(true); // Assuming mocked Round
  //   expect(game.currentRound).toBe(game.rounds.get(initialRoundsSize + 1));
  // });

  // test("newRound throws error if numberOfRounds exceeded", () => {
  //   // Set numberOfRounds to 1 for testing
  //   game = new Game(null, null, { numberOfRounds: 1 });

  //   expect(() => game.newRound({ anyLeanMethod: true })).toThrow(Error);
  // });

  // test("newRound updates stats, stock, starts bots, refreshes workstations, sets up event listener", () => {
  //   const statsSpy = jest.spyOn(game.stats, "newRound");
  //   const stockRefreshSpy = jest.spyOn(game.stock, "refreshStock");
  //   const stockNewRoundSpy = jest.spyOn(game.stock, "newRound");
  //   const botsStartWorkingSpy = jest.spyOn(game.bots, "forEach");
  //   const createRefreshWorkstationsSpy = jest.spyOn(game, "createOrRefreshWorkstations");
  //   const endRoundSpy = jest.spyOn(game, "endRound");

  //   game.newRound({ anyLeanMethod: true }); // Replace with actual leanMethod

  //   expect(statsSpy).toHaveBeenCalled();
  //   expect(stockRefreshSpy).toHaveBeenCalledWith(expect.any(), expect.any()); // Verify arguments passed
  //   expect(stockNewRoundSpy).toHaveBeenCalled();
  //   expect(botsStartWorkingSpy).toHaveBeenCalled();
  //   expect(createRefreshWorkstationsSpy).toHaveBeenCalled();
  //   expect(mockEmitter.on).toHaveBeenCalledWith("roundoverInModel", expect.any(Function)); // Verify event listener
  // });
});
