import { LeanMethod } from "./lean-method.js";

class JustInTime extends LeanMethod {
  constructor() {
    super(
      "Just-In-Time",
      "Orders parts only when needed, reducing inventory costs."
    );
  }

}

export default JustInTime;
