class ErrorComponent extends HTMLElement {
    constructor(error) {
      super();
      this.attachShadow({ mode: "open" });
      this.shadowRoot.innerHTML = `
                <link rel="stylesheet" href="styles.css">
                <h1 class="title">Something went Wrong!</h1>
            <h2 class="error">${error}</h2>
            `;
    }
  
    show() {
      this.classList.remove("hidden");
    }
    hide() {
      this.classList.add("hidden");
    }
  }
  
  customElements.define("error-component", ErrorComponent);
  export { ErrorComponent };
  