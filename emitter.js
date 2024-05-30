class Emitter {
    constructor() {
      this.listeners = {};
    }
  
    on(eventName, callback) {
      if (!this.listeners[eventName]) {
        this.listeners[eventName] = [];
      }
      this.listeners[eventName].push(callback);
    }
  
    emit(eventName, ...args) {
      if (this.listeners[eventName]) {
        this.listeners[eventName].forEach(listener => listener(...args));
      }
    }
  }

  export {Emitter}
  