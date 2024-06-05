import { LeanMethod } from "./lean-method.js";

class JustInTime extends LeanMethod {
  constructor() {
    super("just-in-time",
      "Just-In-Time",
      "Orders parts only when needed, reducing inventory costs."
    );
  }

}

export default JustInTime;
