class Bot extends Occupant {
    constructor(name, workstation, timeInterval) {
      super(name, workstation);
      this.timeInterval = timeInterval || 1000; // Default interval (1 second)
      this.timer = null; // Timer for adding parts
    }
  
    startWorking() {
      // Add a part to the workstation every time interval (simulates bot behavior)
      this.timer = setInterval(() => {
        console.log('add part')
      }, this.timeInterval);
    }
  
    stopAddingParts() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    }
  }
  
  
  export { Bot }