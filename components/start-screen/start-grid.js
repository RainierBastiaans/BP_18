class StartGrid extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `<style>
    #elements {
        display: flex;
        flex-direction: column;
        justify-items: stretch;
        align-items: stretch;
        height: 98vh;
    }

    #element1, #element2, #element3 {
        padding: 10px; /* Add padding for spacing */
        text-align: center; /* Center align text */
    }

    #element1 {
        width: 80%;   
        max-width: 80%;
        font-size: 0.8em;
        max-height: 100%;
    }

    #element2 {
        flex: 1; /* Take up remaining horizontal space */
        max-width: 20%;
    }

    #element3 {
        padding: 0;
        background-color: #28a745;
        border: 0;
        flex: 1; /* Take up remaining vertical space */
        max-height: 30%;
    }

    /* New CSS for the wrapper container */
    #element-container {
        display: flex;
        flex-direction: row; /* Elements 1 and 2 will be displayed next to each other */
        flex-wrap: wrap; /* Allow elements to wrap to the next row */
        align-items: stretch; /* Stretch elements to fill the container */
        height: 90%;
    }

    @media (max-width: 950px) {
        #element-container {
            height: auto;
            flex-direction: column; /* Elements 1 and 2 will be displayed on top of each other */
            align-items: stretch; /* Center align elements */
            gap: 10px; /* Add gap between elements */
            width: 100%; /* Set width to 100% */
        }

        #element1, #element2 {
            max-width: 100%; /* Set max width to 100% */
            align-self: stretch; /* Stretch elements to fill the container */
            width: 97%; /* Set width to 97% */
        }
    }
    </style>

  <div id="elements">
    <div id="element-container">
        <section class="component-style" id="element1"></section>
        <section class="component-style start-screen" id="element2"></section>
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
