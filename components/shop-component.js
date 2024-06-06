class ShopComponent extends HTMLElement {
  constructor(allParts) {
    super();
    this.attachShadow({ mode: "open" });
    this.allParts = allParts;
    this.currentWorkstationIndex = 0; // Track current workstation

    // Group parts by workstation
    this.partsByWorkstation = this.groupPartsByWorkstation();

    this.render();
  }

  groupPartsByWorkstation() {
    this.partsByWorkstation = new Map();
    //every new round workstations get refreshed
    for (let i = 0; i < this.allParts.length / 4; i++) {
      const startIndex = i * 4; // Starting index for each workstation (multiples of 4)
      const partList = this.allParts.slice(startIndex, startIndex + 4); // Slice the first 4 parts
      this.partsByWorkstation.set(i + 1, partList);
    }

    // Optional: Iterate through allParts and assign parts to workstations (if needed)
    // You can add logic here to assign parts to specific workstations based on their properties
    return this.partsByWorkstation;
  }

  render() {
    const shopElement = document.createElement("div");
    shopElement.classList.add("shop-component");

    // Workstation navigation
    const navigation = document.createElement("div");
    navigation.classList.add("shop-navigation");
    const prevButton = document.createElement("button");
    prevButton.textContent = "Previous";
    prevButton.addEventListener("click", () => this.changeWorkstation(-1));
    navigation.appendChild(prevButton);
    const workstationName = document.createElement("span");
    workstationName.classList.add("workstation-label");
    workstationName.textContent = `Workstation ${
      this.currentWorkstationIndex + 1
    }`;
    navigation.appendChild(workstationName);
    const nextButton = document.createElement("button");
    nextButton.textContent = "Next";
    nextButton.addEventListener("click", () => this.changeWorkstation(1));
    navigation.appendChild(nextButton);
    shopElement.appendChild(navigation);

    // Parts list for current workstation
    const partsList = document.createElement("ul");
    partsList.classList.add("shop-parts-list");
    const currentParts = this.partsByWorkstation.get(
      this.currentWorkstationIndex + 1
    );
    for (const partName in currentParts) {
      const part = currentParts[partName];
      const listItem = document.createElement("li");
      listItem.classList.add("shop-part-item");

      const partNameElement = document.createElement("span");
      partNameElement.textContent = part.name;
      listItem.appendChild(partNameElement);

      const quantityInput = document.createElement("input");
      quantityInput.type = "number";
      quantityInput.min = 0;
      quantityInput.max = 100;
      quantityInput.value = 0; // Default quantity
      listItem.appendChild(quantityInput);

      partsList.appendChild(listItem);
    }
    shopElement.appendChild(partsList);

    // Buy button
    const buyButton = document.createElement("button");
    buyButton.classList.add("shop-buy-button");
    buyButton.textContent = "Buy Parts";
    buyButton.addEventListener("click", this.handleBuyParts.bind(this));
    shopElement.appendChild(buyButton);

    this.shadowRoot.appendChild(shopElement);
  }

  changeWorkstation(offset) {
    const newIndex =
      (this.currentWorkstationIndex + offset + this.partsByWorkstation.size) %
      this.partsByWorkstation.size;
    this.currentWorkstationIndex = newIndex;
    this.renderWorkstationParts(); // Update UI with new parts
  }

  renderWorkstationParts() {
    const shopElement = this.shadowRoot.querySelector(".shop-component");
    const workstationName = shopElement.querySelector(".workstation-label");
    workstationName.innerHTML = "";
    workstationName.textContent = `Workstation ${
      this.currentWorkstationIndex + 1
    }`;
    const partsList = shopElement.querySelector(".shop-parts-list");
    partsList.innerHTML = ""; // Clear existing list

    const currentParts = this.partsByWorkstation.get(
      this.currentWorkstationIndex + 1
    );
    for (const partName in currentParts) {
      const part = currentParts[partName];
      const listItem = document.createElement("li");
      listItem.classList.add("shop-part-item");

      const partNameElement = document.createElement("span");
      partNameElement.textContent = part.name;
      listItem.appendChild(partNameElement);

      const quantityInput = document.createElement("input");
      quantityInput.type = "number";
      quantityInput.min = 0;
      quantityInput.max = 100;
      quantityInput.value = 0; // Default quantity
      listItem.appendChild(quantityInput);

      partsList.appendChild(listItem);
    }
  }

  handleBuyParts() {
    const boughtParts = [];
    const shopElement = this.shadowRoot.querySelector(".shop-component");
    const partsList = shopElement.querySelector(".shop-parts-list");

    for (const listItem of partsList.children) {
      const partName = listItem.querySelector("span").textContent;
      const quantityInput = listItem.querySelector("input");
      const quantity = parseInt(quantityInput.value, 10); // Parse quantity as integer

      if (quantity > 0) {
        // Only consider parts with positive quantity
        boughtParts.push({ name: partName, quantity });
      }
    }
    // Dispatch custom event with bought parts list
    const buyPartsEvent = new CustomEvent("buy-parts", {
      detail: {
        bubbles: true,
        composed: true,
        parts: boughtParts,
      },
    });
    this.dispatchEvent(buyPartsEvent);
  }
}

customElements.define("shop-component", ShopComponent);
export { ShopComponent };
