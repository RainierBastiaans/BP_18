class StartGrid extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `<style>
    #elements {
        display: flex;
        flex-direction: column;
        height: 100vh;
    }

    #element1 {
        flex: 8;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    #element2 {
        flex: 2;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    #element3 {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    /* New CSS for the wrapper container */
    #element-container {
        display: flex;
        flex-direction: row; /* Elements 1 and 2 will be displayed next to each other */
        flex: 1; /* Take up remaining vertical space */
    }
</style>

<div id="elements">
    <div id="element-container">
        <section class="component-style" id="element1"></section>
        <section class="component-style" id="element2"></section>
    </div>
    <section class="component-style" id="element3"></section>
</div>

`;
                this.classList.add("start-grid")
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
