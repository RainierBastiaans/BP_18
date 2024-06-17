export const gameValues = {
  // Starting capital for the player
  startCapital: 500000,

  // Facility cost per round
  facilityCost: 50000,

  // Staff cost per round
  staffCost: 10000,

  // Workstation maintenance:
  // - Chance of breakdown with preventive maintenance (TPM)
  workstationBreakdownChanceTPM: 0.0075,
  // - Chance of breakdown without preventive maintenance
  workstationBreakdownChanceNoTPM: 0.05,
  // - Workstation maintenance duration (milliseconds)
  workstationMaintenanceDurationTPM: 3000,
  workstationMaintenanceDurationNoTPM: 5000,

  // Car production:
  // - Fixed price per completed car
  carPrice: 40000,
  // - Chance of a part breaking during car assembly
  partBreakageChanceNoTQC: 0.02,
  partBreakageChanceTQC: 0.01,

  // Bot movement interval (time between moves in milliseconds)
  botMoveIntervalNoOWMin: 1000,
  botMoveIntervalNoOWMax: 2000,
  botMoveIntervalOWMin: 750,
  botMoveIntervalOWMax: 1500,

  // JIT parts extra price multiplier
  jitExtraPrice: 1.5, // Shorter name for extrapriceJit

  // Round duration (seconds)
  roundDuration: 5, // Shorter name for timeOfRound

  // Parts added to stock per round
  //This value was used before the shop was implemented, now this is no longer used. The code for this is still available in the stock classes.
  partsPerRound: 10,

  //Price you have to pay each round for a part that is not used
  pricePerPart: 200,

  //Number of rounds
  numberOfRounds: 2,
};
