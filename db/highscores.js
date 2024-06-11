class HighscoresDB {
  constructor() {
    this.openRequest = indexedDB.open("highscores", 1);
    this.openPromise = new Promise((resolve, reject) => {
      this.openRequest.onsuccess = (event) => {
        this.db = event.target.result;
        console.log("IndexedDB database opened successfully!");
        resolve(); // Resolve the promise when database is opened
      };
      this.openRequest.onerror = (event) => {
        //console.error("Error opening IndexedDB database:", event.target.error);
        reject(event.target.error); // Reject the promise on error
      };
    });

    this.openRequest.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Create an object store named "scores" to store high scores
      const objectStore = db.createObjectStore("scores", {
        keyPath: "id",
        autoIncrement: true,
      });

      // Define an index for sorting by score (descending)
      objectStore.createIndex("scoreIndex", "score", {
        unique: false,
        descending: true,
      });
    };
  }

  async checkForEmptyAndAddDefault() {
    if (!this.db) return;

    const transaction = this.db.transaction(["scores"], "readonly");
    const objectStore = transaction.objectStore("scores");
    const countRequest = objectStore.count();

    const count = await new Promise((resolve, reject) => {
      countRequest.onsuccess = (event) => {
        resolve(event.target.result);
      };
      countRequest.onerror = (event) => {
        reject(event.target.error);
      };
    });

    if (count === 0) {
      //console.log("Database is empty, adding default high score.");
      this.addHighscore("Simon", 50);
      this.addHighscore("Gregory", 70);
      this.addHighscore("Rainier", 10);
    } else {
      //console.log("Database has existing scores.");
    }
  }

  async addHighscore(name, score) {
    console.trace('x')
    if (!this.db) return;

    const transaction = this.db.transaction(["scores"], "readwrite");
    const objectStore = transaction.objectStore("scores");
    const newScore = { name, score };

    const request = objectStore.add(newScore);

    return new Promise((resolve, reject) => {
      request.onsuccess = (event) => {
        console.log("High score added successfully!");
        resolve();
      };
      request.onerror = (event) => {
        //console.error("Error adding high score:", event.target.error);
        reject(event.target.error);
      };
    });
  }

  async getHighscores() {
    if (!this.db) return [];

    const transaction = this.db.transaction(["scores"], "readonly");
    const objectStore = transaction.objectStore("scores");
    const index = objectStore.index("scoreIndex");

    // Request only 3 entries in descending order
    const request = index.openCursor(IDBKeyRange.lowerBound(3), "prev", 3);

    return new Promise((resolve, reject) => {
      const highscores = [];
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          highscores.push(cursor.value);
          cursor.continue();
        } else {
          let sortedhighscores = highscores.sort((a, b) => b.score - a.score);
          resolve(sortedhighscores.slice(0, 3));
        }
      };

      request.onerror = (event) => {
        //console.error("Error retrieving high scores:", event.target.error);
        reject(event.target.error);
      };
    });
  }

  async clearDatabase() {
    if (!this.db) return;
    const transaction = this.db.transaction(["scores"], "readwrite");
    const objectStore = transaction.objectStore("scores");

    const request = objectStore.clear();

    return new Promise((resolve, reject) => {
      request.onsuccess = (event) => {
        console.log("Database cleared successfully!");
        resolve();
      };
      request.onerror = (event) => {
        console.error("Error clearing database:", event.target.error);
        reject(event.target.error);
      };
    });
  }
}
export { HighscoresDB };
