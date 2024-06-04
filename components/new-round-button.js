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
        this.dispatchEvent(
          new CustomEvent("newRound", {
            detail: { },
            bubbles: true,
            composed: true,
          })
        );
      });
  }
  show(){
    this.classList.remove("hidden")
  }
  hide(){
    this.classList.add("hidden")
  }
}

customElements.define("new-round-button", NewRoundButton);
export {NewRoundButton}
