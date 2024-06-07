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
  workstationBreakdownChanceNoTPM: 0.1,
  // - Workstation maintenance duration (seconds)
  workstationMaintenanceDurationTPM: 1000,
  workstationMaintenanceDurationNoTPM: 3000,

  // Car production:
  // - Fixed price per completed car
  carPrice: 20000,
  // - Chance of a part breaking during car assembly
  partBreakageChanceNoTQC: 0.02,
  partBreakageChanceTQC: 0.01,

  // Bot movement interval (time between moves in milliseconds)
  botMoveIntervalNoOWMin: 1500,
  botMoveIntervalNoOWMax: 2500,
  botMoveIntervalOWMin: 750,
  botMoveIntervalOWMax: 1750,


  // JIT parts extra price multiplier
  jitExtraPrice: 1.5, // Shorter name for extrapriceJit

  // Round duration (seconds)
  roundDuration: 50, // Shorter name for timeOfRound

  // Parts added to stock per round
  partsPerRound: 10,

  //Price you have to pay each round for a part that is not used
  pricePerPart: 100,

  //Number of rounds
  numberOfRounds: 5,
};
