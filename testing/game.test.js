import { Game } from "../Models/game.js";
import { HighscoresDB } from "../db/highscores.js";
import { LeanMethodService } from "../lean-methods/lean-method-service.js";

jest.mock("../db/highscores.js"); // Mock HighScoresDB dependency
jest.mock("../lean-methods/lean-method-service.js")

describe("Game", () => {
  let game;

  beforeEach(() => {
    game = new Game(new HighscoresDB(), new LeanMethodService(), null); // Mock or create HighScoresDB instance
  });

  test("constructor initializes game correctly", () => {
    expect(game.db instanceof HighscoresDB).toBe(true); // Check db is HighScoresDB
    expect(game.leanMethodService instanceof LeanMethodService).toBe(true);
    expect(game.isOver).toBe(false); // Check isOver is false
    expect(game.carId).toBe(1); // Check carId is 1
  });
});
