import availableMethods from "../db/leanmethods.json" with {type: "json"}
class RoundSummary extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = `
        <style>
          .options-container {
            text-align: center;
            margin: 20px;
          }
          .options-heading {
            font-size: 1.5em;
            margin-bottom: 10px;
          }
          .summary-text {
            margin-bottom: 20px;
          }
          #applied-methods {
            /* Style for applied methods section */
          }
        </style>
        <div id="options-container" class="options-container">
          <h2>Round Summary</h2>
          <h2>Select Lean Method</h2>
          <div id="available-methods" class="options">
            </div>
          <div id="applied-methods" class="options">
            </div>
        </div>
      `;
<<<<<<< HEAD
=======
  
      this.availableMethods = availableMethods.leanMethods; // Store selected lean methods
    }
  
    connectedCallback() {
      this.leanMethodRadioButtons = this.shadowRoot.querySelectorAll('input[type="radio"][name="game-option"]');
      this.leanMethodRadioButtons.forEach((radioButton) => {
        radioButton.addEventListener("change", this.handleLeanMethodChange.bind(this));
      });
    }
  
    showLeanMethods(leanMethods) {
      const availableMethodsContainer = this.shadowRoot.getElementById("available-methods");
      const appliedMethodsContainer = this.shadowRoot.getElementById("applied-methods")
      availableMethodsContainer.innerHTML = ""; // Clear previous options
      appliedMethodsContainer.innerHTML = "";
  
      this.availableMethods.forEach((leanMethod) => {
        if (!Array.from(leanMethods.keys()).includes(leanMethod.id)) { // Only show non-applied methods
          const option = document.createElement("div");
          option.classList.add("option");
  
          const radioButton = document.createElement("input");
          radioButton.type = "radio";
          radioButton.id = leanMethod.id; // Use leanMethod as ID
          radioButton.name = "game-option";
          radioButton.value = leanMethod.id;
          radioButton.addEventListener("change", this.handleLeanMethodChange.bind(this));
  
          const label = document.createElement("label");
          label.textContent = leanMethod.name;
          label.htmlFor = leanMethod.name;
  
          option.appendChild(radioButton);
          option.appendChild(label);
  
          availableMethodsContainer.appendChild(option);
        }
        else {
            // Create display for already applied methods
            const appliedMethod = document.createElement("div");
            appliedMethod.classList.add("applied-method"); // Add a distinct class for styling
      
            const message = document.createElement("span");
            message.textContent = `- ${leanMethod.name} (Already Applied)`; // Show method name and applied status
      
            appliedMethod.appendChild(message);
            appliedMethodsContainer.appendChild(appliedMethod);
          }
      });
    }
  
    handleLeanMethodChange(event) {
      const selectedLeanMethod = event.target.value;  
  
      this.dispatchEvent(
        new CustomEvent("leanmethodchange", {
          detail: { selectedLeanMethod },
          bubbles: true,
          composed: true,
        })
      );
    }
  
    updateDisplay() {
      const appliedMethodsContainer = this.shadowRoot.getElementById("applied-methods");
  
      appliedMethodsContainer.innerHTML = ""; // Clear previous applied methods
  
      if (this.appliedLeanMethods.length > 0) {
        appliedMethodsContainer.innerHTML = `<h2>Applied Lean Methods</h2>`;
        const list = document.createElement("ul");
        this.appliedLeanMethods.forEach((method) => {
          const listItem = document.createElement("li");
          listItem.textContent = method;
          list.appendChild(listItem);
        });
        appliedMethodsContainer.appendChild(list);
      }
    }
>>>>>>> develop
  }
  connectedCallback() {
    this.leanMethodRadioButtons = this.shadowRoot.querySelectorAll(
      'input[type="radio"][name="game-option"]'
    );
    this.leanMethodRadioButtons.forEach((radioButton) => {
      radioButton.addEventListener(
        "change",
        this.handleLeanMethodChange.bind(this)
      );
    });
  }
  handleLeanMethodChange(event) {
    const selectedLeanMethod = event.target.value;
    this.dispatchEvent(
      new CustomEvent("leanmethodchange", {
        detail: { selectedLeanMethod },
        bubbles: true,
        composed: true,
      })
    );
  }
}

customElements.define("round-summary", RoundSummary);

export { RoundSummary };
