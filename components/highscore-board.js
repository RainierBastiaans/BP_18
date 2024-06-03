
class HighscoreBoard extends HTMLElement {
  constructor(db) {
    super();
    this.db = db; 

    const shadowRoot = this.attachShadow({ mode: "open" });

    const title = document.createElement("h2");
    title.textContent = "Top 3 Highscores";
    shadowRoot.appendChild(title);

    const list = document.createElement("ol");
    shadowRoot.appendChild(list);

  }
  hide(){
    this.classList.add("hidden")
  }

  show(){
    this.classList.remove("hidden")
    this.loadScores()
  }


  connectedCallback() {
    // Wait for db to open
    return this.db.openPromise.then(() => {
      this.loadScores();
    }).catch((error) => {
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
export {HighscoreBoard}