class LetsGetStartButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    const shadowRoot = this.shadowRoot;

    //this.classList.add("start-button-container");

    shadowRoot.innerHTML = `
        <link rel="stylesheet" href="styles.css">
        <style>
        #startButton {
          margin: 0;
          border-radius: 7px;
          }
        </style>
        <button id="startButton">Let's get started!</button>
      `;

    const letsgetstartButton = shadowRoot.querySelector("#startButton");

    letsgetstartButton.addEventListener("click", (event) => {
      this.dispatchEvent(
        new CustomEvent("showConfigScreen", {
          bubbles: true,
          composed: true,
        })
      );
    });
  }

  show() {
    this.classList.remove("hidden");
  }
  hide() {
    this.classList.add("hidden");
  }
}

customElements.define("letsgetstarted-button", LetsGetStartButton);
export { LetsGetStartButton };
