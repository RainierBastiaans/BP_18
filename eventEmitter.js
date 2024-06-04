class eventEmitter extends EventTarget {
  emit(eventName, data) {
    let event;
    if (data === undefined) {
      data = {};
    } else if (typeof data !== "object" || Object.keys(data).length === 0) {
      console.log("Data is empty");
    } else if (data.bubbles && data.composed) {
      console.log("TIME TO BUBBLE UP");
      event = new CustomEvent(eventName, { bubbles: true, composed: true });
    } else {
      console.log("Data is not empty and unknown type");
      event = new CustomEvent(eventName, { detail: data });
    }
    this.dispatchEvent(event);
  }

  on(eventName, callback) {
    this.addEventListener(eventName, callback);
  }
}

export default new eventEmitter();
