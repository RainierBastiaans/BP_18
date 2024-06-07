class Subject {
  constructor() {
    this.observers = [];
  }

  addObserver(observer) {
    this.observers.push(observer);
  }

  removeObserver(observer) {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  notifyObservers(data, sortOfUpdate) {
    if (sortOfUpdate === "stock") {
      this.observers.forEach((observer) => observer.updateStock(data));
    } else if (sortOfUpdate === "car") {
      console.log(this)
      this.observers.forEach((observer) => observer.updateCars(data));
    } else if ((sortOfUpdate === "capital")) {
      this.observers.forEach((observer) => observer.updateCapital(data));
    } else {
      this.observers.forEach((observer) => observer.update(data));
    }
  }
}

export { Subject };
