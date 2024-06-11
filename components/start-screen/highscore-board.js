class HighscoreBoard extends HTMLElement {
  constructor(db) {
    super();
    this.db = db;

    const shadowRoot = this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
    <style>
    :host {
      display: flex;
      flex-direction: column; /* Arrange children vertically */
      align-items: center; /* Center align children horizontally */
      font-family: Arial, sans-serif;
      padding: 20px; /* Add padding for spacing */
      border-radius: 8px; /* Add border radius for rounded corners */
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Add box shadow for depth */
      width: 100%
      height: 100%
  }
  
  h2 {
      margin-top: 0;
      margin-bottom: 20px; /* Add margin for spacing */
      text-align: center;
      color: #0056b3; /* Set text color */
  }
  
  ol {
      padding-left: 0; /* Remove default padding */
      list-style-type: none; /* Remove default list style */
      text-align: center; /* Center align list items */
  }
  
  li {
      margin-bottom: 10px; /* Add margin for spacing */
  }
  
  .trophy-img {
      width: 50px; /* Set smaller width for trophy image */
      height: auto; /* Maintain aspect ratio */
      margin-bottom: 20px; /* Add margin for spacing */
  }
  </style>
   
    <h2>Top 3 Highscores</h2>
    <img class="trophy-img" src="../../img/highscores.png" alt="Trophy"> 
    <ol></ol>
  
  `
  }
  hide() {
    this.classList.add("hidden");
  }

  show() {
    this.classList.remove("hidden");
    this.loadScores();
  }

  connectedCallback() {
    // Wait for db to open
    return this.db.openPromise
      .then(() => {
        this.loadScores();
      })
      .catch((error) => {
        console.error("Error opening database:", error);
      });
  }

  async loadScores() {
    // Use this.db instead of db
    const highscores = await this.db.getHighscores();
    const list = this.shadowRoot.querySelector("ol");
    list.innerHTML = ""; // Clear existing list items

    for (const score of highscores) {
      const listItem = document.createElement("li");
      listItem.textContent = `${score.name}: ${score.score}`;
      list.appendChild(listItem);
    }
  }
}

customElements.define("highscore-board", HighscoreBoard);
export { HighscoreBoard };
