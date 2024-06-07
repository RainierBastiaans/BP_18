class PartsInStock extends HTMLElement {
  constructor(currentWorkstationIndex = 0) {
    super();
    this.attachShadow({ mode: "open" });
    const shadowRoot = this.shadowRoot;
    shadowRoot.innerHTML = `
        <link rel="stylesheet" href="styles.css">
        <div class="parts-in-stock">
            <h2>Parts in stock</h2>
            <ul class="parts-list>
            </ul>
        </div>
        `;

    this.partsList = shadowRoot.querySelector(".parts-list");
    this.partsByWorkstation = this.getPartsByWorkstation(
      currentWorkstationIndex
    );

    //this.render();
  }

  update(relevantParts) {
    this.partsByWorkstation = relevantParts;
    this.render();
  }

  getPartsByWorkstation(workstationIndex) {
    return [];
  }
}

customElements.define("parts-in-stock", PartsInStock);
export { PartsInStock };
