class ConfigGrid extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    const shadowRoot = this.shadowRoot;
    shadowRoot.innerHTML = `
        <link rel="stylesheet" href="styles.css">
        <style>
            .config-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 1rem;
            }
            .config-column {
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }
        </style>
            <section class="config-column" id="config-column-1">
            </section>
            <section class="config-column" id="config-column-2">
            </section>
            <section class="config-column" id="config-column-3">
            </section> 
    `;

    this.classList.add("config-grid");
    // this.container = shadowRoot.querySelector("section");
    this.column1 = shadowRoot.querySelector("#config-column-1");
    this.column2 = shadowRoot.querySelector("#config-column-2");
    this.column3 = shadowRoot.querySelector("#config-column-3");
  }

  appendColumn(number, component) {
    if (number < 1 || number > 3) {
      throw new Error("Column number must be between 1 and 3");
    }
    if (component === undefined || component === null) {
      throw new Error("Component must be defined");
    }
    switch (number) {
      case 1:
        this.column1.appendChild(component);
        break;
      case 2:
        this.column2.appendChild(component);
        break;
      case 3:
        this.column3.appendChild(component);
        break;
      default:
        this.column1.appendChild(component);
    }
  }

  show() {
    this.classList.remove("hidden");
  }
  hide() {
    this.classList.add("hidden");
  }
}

customElements.define("config-grid", ConfigGrid);
export { ConfigGrid };
