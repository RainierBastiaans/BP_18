import { Car } from "./car.js";


class CarBroken extends Car {
    constructor(id, parts) {
      super(id);
      this.parts = parts;
    }

    move(){
        throw new Error('broken car cannot be moved')
    }
}

export {CarBroken}