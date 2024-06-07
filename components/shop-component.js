class ShopComponent extends HTMLElement {
  constructor(allParts) {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
    <link rel="stylesheet" href="styles.css">
  `;
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

    // Heading
    const heading = document.createElement("div");
    heading.classList.add("shop-heading");
    heading.classList.add("horizontal-container");
    shopElement.appendChild(heading);
    const shopSourceReference = document.createElement("a");
    //<a href="" title="warehouse icons"></a>
    shopSourceReference.href = "https://www.flaticon.com/free-icons/warehouse";
    shopSourceReference.title = "warehouse icons";
    heading.appendChild(shopSourceReference);
    const shopIcon = document.createElement("img");
    shopIcon.src = "./img/shop.png";
    shopIcon.alt =
      "Shop represented by: Warehouse icons created by Vectors Tank - Flaticon";
    shopIcon.classList.add("shop-icon");
    shopSourceReference.appendChild(shopIcon);
    const shopTitle = document.createElement("h2");
    shopTitle.textContent = "Shop";
    const shopLabel = document.createElement("label");
    shopLabel.textContent =
      "Welcome to the shop of LEAN Enterprises! Here you can buy parts to build your cars!";
    shopTitle.appendChild(shopLabel);
    heading.appendChild(shopTitle);

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
    shopElement.appendChild(partsList);

    // Buy button
    const buyButton = document.createElement("button");
    buyButton.classList.add("shop-buy-button");
    buyButton.textContent = "Buy Parts";
    buyButton.addEventListener("click", this.handleBuyParts.bind(this));
    shopElement.appendChild(buyButton);

    this.shadowRoot.appendChild(shopElement);
    this.renderWorkstationParts();

    // Button to add 5 to all quantities
    const addFiveButton = document.createElement("button");
    addFiveButton.classList.add("shop-add-five-button"); // Add a class for styling
    addFiveButton.textContent = "Add 5 to All";
    addFiveButton.addEventListener("click", () => this.addFiveToQuantities());
    shopElement.appendChild(addFiveButton);
  }

  // Function to increment all quantities by 5
  addFiveToQuantities() {
    const partsList = this.shadowRoot.querySelector(".shop-parts-list");
    const quantityInputs = partsList.querySelectorAll("input[type='number']");

    for (const input of quantityInputs) {
      const currentValue = parseInt(input.value, 10); // Parse string value to integer
      const newValue = currentValue + 5;
      input.value = Math.max(newValue, 0); // Ensure value doesn't go below 0
    }
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

      const listItem = document.createElement("div"); // Use 'div' for vertical layout
      listItem.classList.add("shop-part-item");

      const partDetails = document.createElement("div");
      partDetails.classList.add("shop-part-details");

      const partNameElement = document.createElement("span");
      partNameElement.textContent = part.name;
      partNameElement.dataset.partId = part.id; // Use a descriptive key
      partDetails.appendChild(partNameElement);

      const priceElement = document.createElement("span");
      priceElement.textContent = `$${part.price.toFixed(2)}`; // Format price with 2 decimals
      partDetails.appendChild(priceElement);

      listItem.appendChild(partDetails);

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
      const partId = listItem.querySelector("span").dataset.partId;
      const quantityInput = listItem.querySelector("input");
      const quantity = parseInt(quantityInput.value, 10); // Parse quantity as integer

      if (quantity > 0) {
        // Only consider parts with positive quantity
        boughtParts.push({ id: partId, quantity });
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

  show() {
    this.classList.remove("hidden");
  }
  hide() {
    this.classList.add("hidden");
  }
}

customElements.define("shop-component", ShopComponent);
export { ShopComponent };
