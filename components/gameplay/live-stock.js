class LiveStock extends HTMLElement {
  constructor(parts) {
    super();

    this.parts = parts || []; // Set default empty array if no parts provided

    this.currentWorkstationIndex = 0; // Track current workstation

    this.attachShadow({ mode: "open" }); // Create shadow DOM
    this.shadowRoot.innerHTML = `
    <link rel="stylesheet" href="styles.css">
  `;
    // Create a container element (replace with your desired structure)
    const container = document.createElement("div");
    container.classList.add("livestock-container");
    container.id = "livestock-container";
    this.shadowRoot.appendChild(container);

    this.groupPartsByWorkstation();
    this.render();
    document.addEventListener("change-workstation", (event) => {
      const newWorkstationIndex = event.detail.currentWorkstationIndex;
      this.currentWorkstationIndex = newWorkstationIndex;
      this.render(); // Update UI with new parts
    });
  }

  hide() {
    this.classList.add("hidden");
  }
  show() {
    this.classList.remove("hidden");
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

  render() {
    let container = this.shadowRoot.querySelector(".livestock-container");
    container.innerHTML = "";

    // Get parts for the current workstation
    const currentWorkstationParts = this.partsByWorkstation.get(
      this.currentWorkstationIndex + 1 // Access workstation based on index + 1
    );

    if (currentWorkstationParts) {
      // List parts (replace with your desired rendering logic)
      const partList = document.createElement("ul");
      partList.classList.add("livestock-part-list");
      for (const part of currentWorkstationParts) {
        const listItem = document.createElement("li");

        // Create separate elements for part name and quantity
        const partName = document.createElement("span");
        partName.classList.add("livestock-part-name");
        partName.textContent = part.name;

        const partQuantity = document.createElement("span");
        partQuantity.classList.add("livestock-part-quantity");
        partQuantity.textContent = `${part.quantity}`;

        // Append elements to the list item
        listItem.appendChild(partName);
        listItem.appendChild(partQuantity);

        partList.appendChild(listItem);
      }
      container.appendChild(partList);
    }
  }
}

// Register the custom element
customElements.define("live-stock", LiveStock);
export { LiveStock };
