# Lean Logistics Game

## Run in Development without setting up server:

### Install *Serve*
In any terminal
```bash
npm install -g serve
```

### Run Serve
In a terminal INSIDE the project directory
```bash
serve
```

### Error? *"...running scripts is disabled on this system..."*
```bash
Set-ExecutionPolicy RemoteSigned -Scope Process
```


## Game Values 
[View the default game values of the game](./game-values.js)

This file contains the standard values of the game.
You can access this file for reference and to adjust specific values as needed for your game configuration.
#### Following fields can be adjusted:
- **startCapital:** the amount of money a player starts with each game
- **facilityCost:** the cost for running the factory each round
- **staffCost:** the cost to pay personnel each round
- **workstationBreakdownChangeNoTPM:** the chance of machinery breakdown
- **workstationMaintenanceDurationNoTPM:** the duration of machinery maintenance/repairs
- **workstationBreakdownChanceTPM:** the chance of machinery breakdown using the lean-method TPM (Total Productive Maintenance)
- **workstationMaintenanceDurationNoTPM:** the duration of machinery maintenance/repairs using the lean-method TPM
- **carPrice:** the money returned when having completed a car
- **partBreakageChanceNoTQC:** the chance of a part breaking during the assembly of your car (resulting in a faulty car at the end that can not be sold)
- **partBreakageChanceTQC:** the chance of a part breaking during the assembly of your car but with the applied lean-method of *Total Quality Control* (this should be lower)
- **botMoveIntervalNoOWMin:** the minimum amount of time a bot takes to execute any type of action during gameplay.
*For example:* clicking a part to add to the car assembly, moving the car to the next workstation, clicking on the TQC (*Total Quality Control*) check
- **botMoveIntervalNoOWMax:** the maximum amount of time a bot takes to execute any type of action.
- **botMoveIntervalOWMin:** the minimum amount of time a bot takes to execute any type of action when the lean-method *Orderly Workplace* is applied.
- **botMoveIntervalOWMax:** the maximum amount of time a bot takes to execute any type of action when the lean-method *Orderly Workplace* is applied.
- **jitExtraPrice:** the factor applied to increase the cost of a part when the lean-method *Just In Time* is applied
- **roundDuration:** the duration/timer of each round. This affects how long a player is able to play and assemble a car.
- **pricePerPart:** the price you have to pay each round for a part that was not used. This can also be called inventory costs per part.
- **numberOfRounds:** the maximum amount of rounds a player is able to play before the game ends. This should be increased when more lean-methods are developed and added to the game.
