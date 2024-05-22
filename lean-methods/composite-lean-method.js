import { LeanMethod } from "./lean-method.js";
class CompositeLeanMethod extends LeanMethod {
    constructor(methods) {
      super("Composite", "Combines multiple lean methods for enhanced efficiency."); // Descriptive name for composite method
      this.methods = methods;
    }
  
  }

  export {CompositeLeanMethod}