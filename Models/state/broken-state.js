import { State } from "./car-state.js"

class BrokenState extends State{
    constructor(){
        super()
    }
    moveWaitingCar(car, cars) {
        return;
      }
}

export {BrokenState}