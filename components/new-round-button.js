class NewRoundButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="styles.css">
      <button id="newRoundButton">Start New Round</button>
    `;

    this.shadowRoot
      .querySelector("#newRoundButton")
      .addEventListener("click", () => {
        this.dispatchEvent(
          new CustomEvent("newRound", {
            detail: {},
            bubbles: true,
            composed: true,
          })
        );
      });
  }
}

customElements.define("new-round-button", NewRoundButton);
