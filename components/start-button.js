class StartButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="styles.css">
            <button id="startButton">Start Game</button>
        `;

    /* 
        This allows any event listeners on the main document or other parent elements to detect
        and handle the startgame event, facilitating interaction between encapsulated components and the broader application.
    */
    this.shadowRoot
      .querySelector("#startButton")
      .addEventListener("click", () => {
        this.dispatchEvent(
          new CustomEvent("startgame", { bubbles: true, composed: true })
        );
      });
  }
}

customElements.define("start-button", StartButton);
