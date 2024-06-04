class GameDescription extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="styles.css">
            <p class = "game-description">
                This is an exciting game where you can test your LEAN skills and challenge your friends.
            </p>
        `;
  }
  show(){
    this.classList.remove("hidden")
  }
  hide(){
    this.classList.add("hidden")
  }
}

customElements.define("game-description", GameDescription);
export {GameDescription}
