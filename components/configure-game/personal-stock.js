class PersonalStock extends HTMLElement {
  constructor(parts) {
    super();

    this.parts = parts || []; // Set default empty array if no parts provided
    this.currentWorkstationIndex = 0; // Track current workstation

    this.attachShadow({ mode: "open" });
    const shadowRoot = this.shadowRoot;
    shadowRoot.innerHTML = `
        <link rel="stylesheet" href="styles.css">
        <div class="personal-stock-container">
            <h2>Parts in stock</h2>
            <div class="personal-stock-list-container">
            </div>
        </div>
        `;
    this.personalStockElement = shadowRoot.querySelector(
      ".personal-stock-container"
    );
    this.groupPartsByWorkstation();
    this.render();
    document.addEventListener("change-workstation", (event) => {
      const newWorkstationIndex = event.detail.currentWorkstationIndex;
      this.currentWorkstationIndex = newWorkstationIndex;
      this.render(); // Update UI with new parts
    });
  }

  update(stock) {
    stock.forEach((value, key) => {
      const partsForWorkstation = this.partsByWorkstation.get(
        value.workstationFK
      );
      partsForWorkstation.forEach((part) => {
        // Update quantity if the part ID matches
        if (part.id === key) {
          part.quantity = value.quantity; // Update quantity
        }
      });
    });
    this.render(); // Update UI with updated quantities
  }

  render() {
    let listContainer = this.shadowRoot.querySelector(
      ".personal-stock-list-container"
    );
    listContainer.innerHTML = ""; // Clear the container

    //Get the parts in stock of current workstation
    const currentWorkstationParts = this.partsByWorkstation.get(
      this.currentWorkstationIndex + 1
    );

    if (currentWorkstationParts) {
      const stockList = document.createElement("ul");
      stockList.classList.add("personal-stock-list");
      for (const part of currentWorkstationParts) {
        const listItem = document.createElement("li");

        //Create separate elements for part name and quantity
        const partName = document.createElement("span");
        partName.classList.add("personal-stock-name");
        partName.textContent = part.name + " ";

        const partQuantity = document.createElement("span");
        partQuantity.classList.add("personal-stock-quantity");
        partQuantity.textContent = `${part.quantity}`;

        listItem.appendChild(partName);
        listItem.appendChild(partQuantity);
        stockList.appendChild(listItem);
      }
      listContainer.appendChild(stockList);
    }
  }

  groupPartsByWorkstation() {
    this.partsByWorkstation = new Map();
    this.parts.forEach((part) => {
      const workstationId = part.workstationFK; // Assuming attribute name for workstation ID

      // Check if workstation entry exists in the map
      if (!this.partsByWorkstation.has(workstationId)) {
        this.partsByWorkstation.set(workstationId, []); // Create an empty list for the workstation
      }

      // Add default quantity if not present
      const updatedPart = {
        ...part, // Spread existing properties
        quantity: part.quantity !== undefined ? part.quantity : 0, // Set default quantity if missing
      };

      this.partsByWorkstation.get(workstationId).push(updatedPart);
    });
  }

  show() {
    this.classList.remove("hidden");
  }

  hide() {
    this.classList.add("hidden");
  }
}

customElements.define("personal-stock", PersonalStock);
export { PersonalStock };
