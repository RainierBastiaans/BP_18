class FixedCosts extends HTMLElement {
  constructor(fixedCosts) {
    super();

    this.fixedCosts = fixedCosts || {}; // Set default empty array if no fixedCosts provided

    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="styles.css">
        <div class="fixed-costs-container vertical-container">
            <h2>Fixed Costs</h2>
            <div class="fixed-costs-list-container">
                <ul class="fixed-costs-list">
                <div class="hidden" alt="References for icons of workstations">
                    <a href="https://www.flaticon.com/free-icons/gold-bars" title="gold-bars icons">Gold-bars icons created by surang - Flaticon</a>
                    <a href="https://www.flaticon.com/free-icons/personnel" title="personnel icons">Personnel icons created by Eucalyp - Flaticon</a>
                    <a href="https://www.flaticon.com/free-icons/facility-management" title="facility-management icons">Facility-management icons created by Eucalyp - Flaticon</a>
                    <a href="https://www.flaticon.com/free-icons/price" title="price icons">Price icons created by Freepik - Flaticon</a>
                </div>
                    ${this.createFixedCostElement(
                      "Start capital",
                      "startCapital",
                      fixedCosts.startCapital
                    )}
                    ${this.createFixedCostElement(
                      "Facility costs",
                      "facilityCosts",
                      fixedCosts.facility
                    )}
                    ${this.createFixedCostElement(
                      "Personnel costs",
                      "personnelCosts",
                      fixedCosts.staff
                    )}
                    ${this.createFixedCostElement(
                      "Price per part",
                      "pricePerPart",
                      fixedCosts.pricePerPart
                    )}
                </ul>
            </div>
        </div>
        `;
    this.classList.add("component-style");
    //this.render();
  }

  createFixedCostElement(name, imgName, fixedCost) {
    return `
        <li>
            <img src="./img/fixedCosts/${imgName}.png" alt="fixed cost icon: ${name}" class="fixed-cost-icon">
            <span class="fixed-cost-name">${name}</span>
            <span class="fixed-cost-price">${fixedCost}</span>
        </li>
    `;
  }
}

customElements.define("fixed-costs", FixedCosts);
export { FixedCosts };
