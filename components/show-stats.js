class ShowStats extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
            <style>
                /* Style the statistics container */
                .statistics-container {
                    text-align: center;
                    margin-top: 20px;
                }
                .statistics-heading {
                    font-size: 1.5em;
                    margin-bottom: 10px;
                }
                .statistics-info {
                    font-size: 1.2em;
                }
            </style>
            <div class="statistics-container">
                <h2 class="statistics-heading">Game Statistics</h2>
                <p class="statistics-info">Your final score: <span id="finalScore">0</span></p>
                <!-- Add more statistics here if needed -->
            </div>
        `;
    this.finalScoreElement = this.shadowRoot.querySelector("#finalScore");
  }

  // Method to update the final score
  updateScore(score) {
    this.finalScoreElement.textContent = score;
  }
}

customElements.define("show-stats", ShowStats);
