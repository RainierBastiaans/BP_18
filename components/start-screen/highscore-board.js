import { formatLargeNumber } from "../../format-number.js";
class HighscoreBoard extends HTMLElement {
  constructor(db) {
    super();
    this.db = db;

    const shadowRoot = this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
    <style>
    :host {
      align-items: center; /* Center align children horizontally */
      padding: 0.1em; /* Add padding for spacing */
      width: 100%
      height: 100%
  }
  
  h1 {
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
      width: auto; /* Set smaller width for trophy image */
      height: auto; /* Maintain aspect ratio */
      max-width: 8em; /* Ensure image does not exceed parent width */
      margin-bottom: 20px; /* Add margin for spacing */
  }
  </style>
   
    <h1>Top 3 Highscores</h1>
    <img class="trophy-img" src="../../img/highscores.png" alt="Trophy"> 
    <ol></ol>
  
  `;
    this.classList.add("vertical-container");
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
      listItem.textContent = `${score.name}: ${formatLargeNumber(score.score)}`;
      list.appendChild(listItem);
    }
  }
}

customElements.define("highscore-board", HighscoreBoard);
export { HighscoreBoard };
