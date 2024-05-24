import { CarState } from "./car-state.js"

class BrokenState extends CarState{
    constructor(){
        super()
    }
    moveWaitingCar(car, cars) {
        return;
      }
}

export {BrokenState}