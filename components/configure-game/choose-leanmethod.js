class ChooseLeanmethod extends HTMLElement {
  constructor(leanMethods) {
    super();
    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="styles.css">
      <div id="leanmethods-container" class="leanmethods-container vertical-container">
        <h2>Select Lean Method</h2>
        <div class="leanmethods-list-container">
          <h3 class="leanmethod-list-title">Available Lean Methods</h3>
          <p class="leanmethod-list-description">Choose a Lean Method to apply to your workstation</p>
          <ul id="available-methods" class="leanmethods-list">
          </ul>
          <h3 class="leanmethod-list-title">Applied Lean Methods</h3>
          <p class="leanmethod-list-description">You have already applied the lean methods listed below to your assembly process.</p>
          <ul id="applied-methods" class="leanmethods-list">
          </ul>
          <div class="hidden" alt="References for icons of LEAN methods">
            <a href="https://www.flaticon.com/free-icons/just-in-time" title="just in time icons">Just in time icons created by Iconjam - Flaticon</a>
            <a href="https://www.flaticon.com/free-icons/excellence" title="Excellence icons">Excellence icons created by Uniconlabs - Flaticon</a>
            <a href="https://www.flaticon.com/free-icons/maintenance" title="maintenance icons">Maintenance icons created by Freepik - Flaticon</a>
            <a href="https://www.flaticon.com/free-icons/sort" title="sort icons">Sort icons created by Parzival 1997 - Flaticon</a>
          </div>
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
        // console.log(radioButton);

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
    return `
      <li class="available-method-container">
        <input type="radio" id="leanmethod-${leanMethod.id}" name="game-option" value="${leanMethod.id}" class="hidden">
        <div class="available-method">
          <img src="img/choose-leanmethods/${leanMethod.id}.png" alt="${leanMethod.name}" class="icon">
          <label for="leanmethod-${leanMethod.id}" class="leanmethod-name">${leanMethod.name}
            <span class="tooltip">${leanMethod.description}</span>
          </label>
        </div>
      </li>
    `;
  }

  createAppliedLeanMethod(leanMethod) {
    return `
      <li class="applied-method">
        <img src="img/choose-leanmethods/${leanMethod.id}.png" alt="${leanMethod.name}" class="icon">
        <span class="leanmethod-name">${leanMethod.name}</span>
      </li>
    `;
  }

  handleLeanMethodChange(event) {
    const selectedLeanMethod = event.target.value;
    // console.log(selectedLeanMethod);

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
