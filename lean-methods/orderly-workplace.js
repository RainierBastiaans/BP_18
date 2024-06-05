import { LeanMethod } from "./lean-method.js";

class OrderlyWorkplace extends LeanMethod {
  constructor() {
    super(
      "Orderly Workplace",
      "description"
    );
    this.isEnabled = false;
  }

  enable(){
    this.isEnabled = true;
  }
  
}

export default OrderlyWorkplace;
