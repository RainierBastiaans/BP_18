import { CarState } from "./car-state.js"

class SoldState extends CarState{
    constructor(){
        super()
    }
    moveWaitingCar(car, cars) {
        return;
      }
}

export {SoldState}