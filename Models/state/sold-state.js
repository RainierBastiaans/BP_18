import { State } from "./car-state.js"

class SoldState extends State{
    constructor(){
        super()
    }
    moveWaitingCar(car, cars) {
        return;
      }
}

export {SoldState}