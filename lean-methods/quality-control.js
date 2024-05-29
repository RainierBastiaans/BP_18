import { LeanMethod } from "./lean-method.js";

class QualityControl extends LeanMethod {
    constructor() {
      super("Quality Control", "Inspects parts before assembly to reduce defects.");
    }
  
    applyMethod(workstation) {
      // Implement Quality Control logic (e.g., inspect parts before assembly)
      //console.log("Quality Control applied to workstation:", workstation.id);
    }
  }

  export {QualityControl}