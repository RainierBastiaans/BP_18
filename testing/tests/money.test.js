import { Money } from "../../Models/money";
jest.mock("../../subject.js"); // Mock Subject dependency

describe("Money", () => {
  let stats, money;

  beforeEach(() => {
    stats = { update: jest.fn() }; // Mock stats object
    money = new Money(stats, 1000.45); // Create Money with initial amount
  });

  test("constructor initializes amount correctly with formatting", () => {
    expect(money.amount).toBe(1000); // Format removes decimals
  });

  test("add method increases amount and notifies observers", () => {
    money.add(500);

    expect(money.amount).toBe(1500);
    expect(money.notifyObservers).toHaveBeenCalled(); // Check if notifyObservers was called
});

  test("add method throws error for insufficient funds", () => {
    expect(() => money.deduct(2000)).toThrow(Error);
  });

  test("deduct method decreases amount and notifies observers (sufficient funds)", () => {
    money.deduct(500);

    expect(money.amount).toBe(500);
    expect(money.notifyObservers).toHaveBeenCalled(); // Check if notifyObservers was called
  });

  test("getAmount method returns the current amount", () => {
    expect(money.getAmount()).toBe(1000); // Format removed in constructor
  });

  test("formatAmount formats a number to 0 decimal places", () => {
    expect(money.formatAmount(1234.46)).toBe(1234);
    expect(money.formatAmount(1234.56)).toBe(1235);
  });
});
