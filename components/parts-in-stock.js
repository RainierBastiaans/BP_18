class PartsInStock extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    const shadowRoot = this.shadowRoot;
    shadowRoot.innerHTML = `
        <link rel="stylesheet" href="styles.css">
        <div class="parts-in-stock">
            <h2>Parts in stock</h2>
            <p class="parts-in-stock-empty">Buy parts to build your cars!</p>
        </div>
        `;

    this.partsInStockElement = shadowRoot.querySelector(".parts-in-stock");
  }

  update(relevantStock) {
    if (relevantStock.length !== undefined || relevantStock.length !== null) {
      this.shadowRoot
        .querySelector(".parts-in-stock-empty")
        .classList.add("hidden");
      return;
    }
    const stockList = document.createElement("ul");
    stockList.classList.add("parts-in-stock-list");
    this.partsInStockElement.appendChild(stockList);
    const partsInStockComponents = relevantStock.map((part) => {
      const partElement = document.createElement("li");
      partElement.textContent = part.name;
      return partElement;
    });
    stockList.append(...partsInStockComponents);
  }
}

customElements.define("parts-in-stock", PartsInStock);
export { PartsInStock };
