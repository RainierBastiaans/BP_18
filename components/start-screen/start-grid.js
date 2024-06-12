class StartGrid extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `<style>
    #elements {
        display: flex;
        flex-direction: column;
    }

    #element1, #element2, #element3 {
        padding: 10px; /* Add padding for spacing */
        text-align: center; /* Center align text */
    }

    #element1 {
        flex: 80;
        font-size: 0.8em;
    }

    #element2 {
        flex: 20;
    }

    #element3 {
        flex: 100;
        height: 1vh;
        padding: 0;
        background-color: #28a745;
        border: 0;
    }
    /* New CSS for the wrapper container */
    #element-container {
        display: flex;
        flex-direction: row; /* Elements 1 and 2 will be displayed next to each other */
        flex: 1; /* Take up remaining vertical space */
        height: 80vh
    }
</style>

<div id="elements">
    <div id="element-container">
        <section class="component-style" id="element1"></section>
        <section class="component-style start-screen";" id="element2"></section>
    </div>
    <section class="component-style" id="element3"></section>
</div>

`;
    this.classList.add("start-grid");
    this.column1 = this.querySelector("#element1");
    this.column2 = this.querySelector("#element2");
    this.column3 = this.querySelector("#element3");
  }

  appendColumn(number, component) {
    if (number < 1 || number > 3) {
      throw new Error("Column number must be between 1 and 3");
    }
    if (component === undefined || component === null) {
      throw new Error("Component must be defined");
    }
    switch (number) {
      case 1:
        this.column1.appendChild(component);
        break;
      case 2:
        this.column2.appendChild(component);
        break;
      case 3:
        this.column3.appendChild(component);
        break;
      default:
        this.column1.appendChild(component);
    }
  }
}

customElements.define("start-grid", StartGrid);
export { StartGrid };
