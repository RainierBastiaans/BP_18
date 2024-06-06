class ConfigGrid extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    const shadowRoot = this.shadowRoot;
    shadowRoot.innerHTML = `
        <link rel="stylesheet" href="styles.css">
        <section></section>
    `;

    this.container = shadowRoot.querySelector("section");
  }

  appendComponent(component) {
    this.container.appendChild(component);
  }
}

customElements.define("config-grid", ConfigGrid);
export { ConfigGrid };
