class Observer {
    update(subject){
        throw new Error("Method 'update()' must be implemented!");
    }
}

export { Observer };


// class Observer {
//     constructor() {
//         this.observers = [];
//     }

//     subscribe(observer) {
//         this.observers.push(observer);
//     }

//     unsubscribe(observer) {
//         this.observers = this.observers.filter(obs => obs !== observer);
//     }

//     notify(data) {
//         this.observers.forEach(observer => observer.update(data));
//     }
// }

// class ConcreteObserver {
//     //update(data) {
//         // Do something with the data
//         //console.log('Received data:', data);
//     //}
// }

// // Usage example:
// const observer = new Observer();
// const concreteObserver = new ConcreteObserver();

// observer.subscribe(concreteObserver);
// observer.notify('Hello, world!');

// observer.unsubscribe(concreteObserver);

// class AnotherConcreteObserver {
//     update(data) {
//         // Do something else with the data
//         console.log('Another observer received data:', data);
//     }
// }

// const anotherConcreteObserver = new AnotherConcreteObserver();
// observer.subscribe(anotherConcreteObserver);
// observer.notify('Hello again, world!');

// observer.unsubscribe(anotherConcreteObserver);