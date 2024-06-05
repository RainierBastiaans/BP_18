import { LeanMethod } from "./lean-method.js";

class OrderlyWorkplace extends LeanMethod {
  constructor() {
    super(
        "orderly-workplace",
      "Orderly Workplace",
      "description"
    );
    this.isEnabled = false;
  }
  
}

export default OrderlyWorkplace;
