export const gameValues = {
  // Starting capital for the player
  startCapital: 500000,

  // Facility cost per round
  facilityCost: 50000,

  // Staff cost per round
  staffCost: 10000,

  // Workstation maintenance:
  // - Chance of breakdown with preventive maintenance (TPM)
  workstationBreakdownChanceTPM: 0.001,
  // - Chance of breakdown without preventive maintenance
  workstationBreakdownChanceNoTPM: 0.0,
  // - Workstation maintenance duration (seconds)
  workstationMaintenanceDuration: 3000,

  // Car production:
  // - Fixed price per completed car
  carPrice: 20000,
  // - Chance of a part breaking during car assembly
  partBreakageChance: 0.02,

  // Bot movement interval (time between moves in milliseconds)
  botMoveInterval: 500,

  // JIT parts extra price multiplier
  jitExtraPrice: 1.5, // Shorter name for extrapriceJit

  // Round duration (seconds)
  roundDuration: 10, // Shorter name for timeOfRound

  // Parts added to stock per round
  partsPerRound: 5,

  //Number of rounds
  numberOfRounds: 5,
};
