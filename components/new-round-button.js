class NewRoundButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
        button {
          display: block;
          padding: 10px 20px;
          font-size: 20px;
          margin: 30px auto;
          background-color: #28a745;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        button:hover {
          background-color: #218838;
        }
      </style>
      <button id="newRoundButton">Start New Round</button>
    `;

    this.shadowRoot
      .querySelector("#newRoundButton")
      .addEventListener("click", () => {
        // Get the selected lean method from the game options element
        const gameOptions = document.querySelector("game-options");
        const selectedOption = gameOptions.shadowRoot
          ? gameOptions.shadowRoot.querySelector('input[type="checkbox"]:checked')?.id
          : null; // Handle potential shadow DOM

        this.dispatchEvent(
          new CustomEvent("newRound", {
            detail: { selectedLeanMethod: selectedOption },
            bubbles: true,
            composed: true,
          })
        );
      });
  }
}

customElements.define("new-round-button", NewRoundButton);
