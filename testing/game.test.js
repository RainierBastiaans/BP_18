// Game.test.js
import { Game } from "../Models/game.js";
import { Money } from "../Models/money.js"; // Assuming Money class exists
import { TraditionalStock } from "../Models/stock/traditional-stock.js"; // Assuming TraditionalStock class exists
import { Round } from "../Models/round.js"; // Assuming Round class exists
import { WorkingWorkstation } from "../Models/state/workstation/workstation-working.js"; // Assuming WorkingWorkstation class exists

jest.mock("../Models/money.js"); // Mock Money dependency
jest.mock("../Models/stock/traditional-stock.js"); // Mock TraditionalStock dependency
jest.mock("../Models/round.js"); // Mock Round dependency
jest.mock("../Models/state/workstation/workstation-working.js"); // Mock WorkingWorkstation dependency

describe("Game", () => {
  let game;

  beforeEach(() => {
    game = new Game();
  });

  test("constructor initializes game state correctly", () => {
    expect(game.workstations.size).toBe(5); // Check workstation map size
    expect(
      Array.from(game.workstations.values()).every(
        (value) => value instanceof WorkingWorkstation
      )
    ).toBe(true); // Check workstation values are WorkingWorkstation instances

    expect(game.capital instanceof Money).toBe(true); // Check capital is a Money object
    expect(game.stock instanceof TraditionalStock).toBe(true); // Check stock is a TraditionalStock object

    expect(game.cars.size).toBe(1); // Check cars map contains one car

    expect(game.rounds.size).toBe(1); // Check rounds map contains one round
    expect(game.rounds.get(1) instanceof Round).toBe(true); // Check round is a Round object
  });
});
