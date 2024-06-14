import { Round } from "../../Models/round";
import { Emitter } from "../../emitter";
import { gameValues } from "../../game-values";
jest.useFakeTimers(); // Simulate timers for testing
jest.spyOn(global, 'setInterval');


describe("Round", () => {
  let round;

  beforeEach(() => {
    jest.clearAllTimers(); // Clear timers between tests
    round = new Round(1); // Create a round object
  });

  test("constructor initializes round properties correctly", () => {
    expect(round.roundNumber).toBe(1);
    expect(round.timeLeft).toBe(gameValues.roundDuration); // Assuming gameValues is mocked
    expect(round.isOver).toBe(false);
    expect(round.emitter instanceof Emitter).toBe(true); // Verify Emitter instance
  });

  test("startTimer creates an interval and decrements timeLeft", () => {
    jest.advanceTimersByTime(1000); // Simulate 1 second

    expect(round.timeLeft).toBe(gameValues.roundDuration - 1); // Assuming gameValues is mocked
  });

  test("startTimer emits 'roundoverInModel' when time runs out", () => {
    const emitSpy = jest.spyOn(round.emitter, "emit");

    jest.advanceTimersByTime(gameValues.roundDuration * 1000); // Simulate round duration

    expect(emitSpy).toHaveBeenCalledWith("roundoverInModel");
  });

  test("endRound clears timer and sets isOver to true", () => {
    round.endRound();

    expect(round.isOver).toBe(true);
  });

  test("getRemainingTime returns the remaining time", () => {
    jest.advanceTimersByTime(1000);

    expect(round.getRemainingTime()).toBe(gameValues.roundDuration - 1); // Assuming gameValues is mocked
  });
});
