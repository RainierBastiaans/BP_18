class Subject {
  constructor() {
    this.observers = [];
  }

  addObserver(observer) {
    if (!observer.update) {
      throw new Error("Observer must implement the update method");
    }
    this.observers.push(observer);
    console.log(this.observers)
  }

  removeObserver(observer) {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  notifyObservers(data) {
    this.observers.forEach((observer) => observer.update(data));
  }
}

export { Subject };
