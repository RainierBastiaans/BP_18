import { Game } from "../Models/game.js";
import { HighscoresDB } from "../db/highscores.js";
import { LeanMethodService } from "../lean-methods/lean-method-service.js";

jest.mock("../db/highscores.js"); // Mock HighScoresDB dependency
jest.mock("../lean-methods/lean-method-service.js");

describe("Game", () => {
  let game;

  beforeEach(() => {
    game = new Game(new HighscoresDB(), new LeanMethodService(), null);
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

  
});
