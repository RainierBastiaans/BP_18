class RestartButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    const shadowRoot = this.shadowRoot;

    //this.classList.add("start-button-container");

    shadowRoot.innerHTML = `
          <link rel="stylesheet" href="styles.css">
          <style>
          #restartButton {
            margin: 0;
            border-radius: 7px;
            height: 100%;
            width: 100%;
            }
          </style>
          <button id="restartButton">Restart game</button>
        `;

    const restartButton = shadowRoot.querySelector("#restartButton");

    restartButton.addEventListener("click", (event) => {
      window.location.reload();
    });
  }

  show() {
    this.classList.remove("hidden");
  }
  hide() {
    this.classList.add("hidden");
  }
}

customElements.define("restart-button", RestartButton);
export { RestartButton };
