import { Stock } from "../../Models/stock/stock";
jest.mock("../../subject.js"); // Mock Subject dependency
jest.mock("../../Models/stock/jit-stock.js"); // Mock JITStock dependency (optional)
jest.mock("../../Models/stock/traditional-stock.js"); // Mock TraditionalStock dependency (optional)

describe("Stock", () => {
  let parts, gamestats, leanMethodService, stock;

  beforeEach(() => {
    parts = [
      { name: "chassis", price: 1000 },
      { name: "hood", price: 55.55 },
    ];
    gamestats = { update: jest.fn() }; // Mock gamestats object
    leanMethodService = { getLeanMethod: jest.fn() }; // Mock leanMethodService

    stock = new Stock(parts, gamestats, leanMethodService);
  });

  test("constructor initializes parts map correctly", () => {
    expect(stock.parts.size).toBe(2);
    expect(stock.parts.get("chassis").price).toBe(1000); // Verify part data
    expect(stock.parts.get("hood").price).toBe(55.55); // Verify part data
  });

  test("constructor filters out invalid parts", () => {
    const invalidParts = [...parts, { price: 100 }]; // Add invalid part
    stock = new Stock(invalidParts, gamestats, leanMethodService);

    expect(stock.parts.size).toBe(2); // Only valid parts should be added
  });

  test("state setter updates state with type check", () => {
    const mockState = { someProperty: "value" };
    stock.state = mockState;

    expect(stock.state).toBe(mockState);

    const newState = { differentProperty: "anotherValue" };
    stock.state = newState; // Different type, no update

    expect(stock.state).toBe(mockState); // Original state remains
  });

  test("getAmountOfPart returns the quantity for a part", () => {
    expect(stock.getAmountOfPart("chassis")).toBe(0); // Initial quantity is 0
  });

  // Consider adding tests for requestPart and newRound based on subclass behavior
});