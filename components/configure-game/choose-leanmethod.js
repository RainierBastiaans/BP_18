class ChooseLeanmethod extends HTMLElement {
  constructor(leanMethods) {
    super();
    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="styles.css">
      <div id="options-container" class="options-container">
        <h2>Select Lean Method</h2>
        <div id="available-methods" class="options">
        </div>
        <div id="applied-methods" class="options">
        </div>
      </div>
    `;
    this.classList.add("component-style");
    this.leanMethods = leanMethods || [];
  }

  connectedCallback() {
    this.showLeanMethods(this.leanMethods);
  }

  showLeanMethods(leanMethods) {
    const availableMethodsContainer =
      this.shadowRoot.getElementById("available-methods");
    const appliedMethodsContainer =
      this.shadowRoot.getElementById("applied-methods");

    availableMethodsContainer.innerHTML = ""; // Clear previous options
    appliedMethodsContainer.innerHTML = "";

    leanMethods.forEach((leanMethod) => {
      if (!leanMethod.isEnabled) {
        availableMethodsContainer.insertAdjacentHTML(
          "beforeend",
          this.createLeanMethodOption(leanMethod)
        );

        const radioButton = this.shadowRoot.getElementById(
          `leanmethod-${leanMethod.id}`
        );
        console.log(radioButton);

        if (radioButton) {
          radioButton.addEventListener(
            "change",
            this.handleLeanMethodChange.bind(this)
          );
        }
      } else {
        appliedMethodsContainer.insertAdjacentHTML(
          "beforeend",
          this.createAppliedLeanMethod(leanMethod)
        );
      }
    });
  }

  createLeanMethodOption(leanMethod) {
    //TODO add images to lean methods
    //images must match lean method id
    return `
      <div class="option">
        <input type="radio" id="leanmethod-${leanMethod.id}" name="game-option" value="${leanMethod.id}">
        <label for="leanmethod-${leanMethod.id}">${leanMethod.name}
          <span class="tooltip">${leanMethod.description}</span>
        </label>
      </div>
    `;
  }

  createAppliedLeanMethod(leanMethod) {
    return `
      <div class="applied-method">
        <span>- ${leanMethod.name} (Already Applied)</span>
      </div>
    `;
  }

  handleLeanMethodChange(event) {
    const selectedLeanMethod = event.target.value;
    console.log(selectedLeanMethod);

    this.dispatchEvent(
      new CustomEvent("leanmethodchange", {
        detail: { selectedLeanMethod },
        bubbles: true,
        composed: true,
      })
    );
  }

  show() {
    this.classList.remove("hidden");
  }
  hide() {
    this.classList.add("hidden");
  }
}
customElements.define("choose-leanmethod", ChooseLeanmethod);
export { ChooseLeanmethod };
