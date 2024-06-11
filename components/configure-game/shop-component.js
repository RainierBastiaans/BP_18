import { PersonalStock } from "./personal-stock.js";

class ShopComponent extends HTMLElement {
  constructor(allParts, personalStockComponent) {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
    <link rel="stylesheet" href="styles.css">
  `;
    this.classList.add("component-style");
    this.allParts = allParts;
    this.currentWorkstationIndex = 0; // Track current workstation

    // Group parts by workstation
    this.groupPartsByWorkstation();
    this.personalStockComponent = personalStockComponent;
    console.log(personalStockComponent);
    this.shadowRoot.appendChild(this.personalStockComponent);
  }

  connectedCallback() {
    this.render();
  }

  groupPartsByWorkstation() {
    this.partsByWorkstation = new Map();
    this.allParts.forEach((part) => {
      const workstationId = part.workstationFK; // Assuming attribute name for workstation ID

      // Check if workstation entry exists in the map
      if (!this.partsByWorkstation.has(workstationId)) {
        this.partsByWorkstation.set(workstationId, []); // Create an empty list for the workstation
      }

      this.partsByWorkstation.get(workstationId).push(part);
    });
  }

  render() {
    const shopElement = document.createElement("div");
    shopElement.classList.add("shop-component");

    // Heading
    const heading = document.createElement("div");
    heading.classList.add("shop-heading");
    heading.classList.add("horizontal-container");
    shopElement.appendChild(heading);

    // Add a reference to the source of the shop icon
    const shopSourceContainer = document.createElement("div");
    shopSourceContainer.classList.add("hidden");
    heading.appendChild(shopSourceContainer);
    const shopSourceReference = document.createElement("a");
    shopSourceReference.href = "https://www.flaticon.com/free-icons/warehouse";
    shopSourceReference.title = "warehouse icons";
    shopSourceReference.alt =
      "represented by: Warehouse icons created by Vectors Tank - Flaticon";
    shopSourceContainer.appendChild(shopSourceReference);

    // Shop icon
    const shopIcon = document.createElement("img");
    shopIcon.src = "./img/shop.png";
    shopIcon.alt = "Shop icon";
    shopIcon.classList.add("shop-icon");
    heading.appendChild(shopIcon);

    //Title
    const shopTitle = document.createElement("h2");
    shopTitle.textContent = "Shop";
    heading.appendChild(shopTitle);

    //HOVER: Add a tip to the shop
    const shopTip = document.createElement("span");
    shopTip.classList.add("shop-tip");
    shopTip.textContent =
      "Welcome to the shop of LEAN Enterprises! Here you can buy parts to build your cars!";
    shopTitle.appendChild(shopTip);

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

    const addAmountButtons = document.createElement("div");
    addAmountButtons.classList.add("shop-add-amount-buttons");
    shopElement.appendChild(addAmountButtons);

    // Button to add 1 to all quantities
    const addOneButton = document.createElement("button");
    addOneButton.classList.add("shop-add-amount-button"); // Add a class for styling
    addOneButton.textContent = "Add 1 to All";
    addOneButton.addEventListener("click", () =>
      this.addAmountToAllQuantities(1)
    );
    addAmountButtons.appendChild(addOneButton);

    // Button to add 5 to all quantities
    const addFiveButton = document.createElement("button");
    addFiveButton.classList.add("shop-add-amount-button"); // Add a class for styling
    addFiveButton.textContent = "Add 5 to All";
    addFiveButton.addEventListener("click", () =>
      this.addAmountToAllQuantities(5)
    );
    addAmountButtons.appendChild(addFiveButton);

    // Button to add 10 to all quantities
    const addTenButton = document.createElement("button");
    addTenButton.classList.add("shop-add-amount-button"); // Add a class for styling
    addTenButton.textContent = "Add 10 to All";
    addTenButton.addEventListener("click", () =>
      this.addAmountToAllQuantities(10)
    );
    addAmountButtons.appendChild(addTenButton);
  }

  // Function to increment all quantities by 5
  addAmountToAllQuantities(amount) {
    const partsList = this.shadowRoot.querySelector(".shop-parts-list");
    const quantityInputs = partsList.querySelectorAll("input[type='number']");

    for (const input of quantityInputs) {
      const currentValue = parseInt(input.value, 10); // Parse string value to integer with base 10 (=decimal)
      const newValue = currentValue + amount;
      input.value = Math.max(newValue, 0); // Ensure value doesn't go below 0
    }
  }

  changeWorkstation(offset) {
    const workstationSize = this.partsByWorkstation.size; // Get number of workstations

    // Calculate new index with wrapping (avoid negative values)
    const newIndex =
      (this.currentWorkstationIndex + offset + workstationSize) %
      workstationSize;

    // Update current workstation index
    this.currentWorkstationIndex = newIndex;

    // Render parts for the new workstation
    this.renderWorkstationParts();

    // Dispatch custom event 'change-workstation'
    document.dispatchEvent(
      new CustomEvent("change-workstation", {
        detail: {
          currentWorkstationIndex: this.currentWorkstationIndex,
          bubbles: true,
          composed: true,
        },
      })
    );
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
      priceElement.textContent = `€ ${part.price.toFixed(2)}`; // Format price with 2 decimals
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
