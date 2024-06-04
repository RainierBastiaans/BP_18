export const gameTemplate = document.createElement("template");
gameTemplate.innerHTML = `
<p id="message">Work On Workstation</p>
<canvas id="bp-game-canvas" width="500" height="300"></canvas>
<button id="previous-station-button">Previous Station</button>
<button id="next-station-button">Next Station</button>
<p id="completedCarsElement">Cars completed: 0</p>
<p id="partsAddedElement">0/0 parts added</p>
<button id="move-car-button">Move Car to Next Station</button>
<button id = "quality-control">Quality Control</button> 
<div id="current-workstation">
  <span class="maintenance-timer"></span>
</div>
`;

class LeanGame extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
        <style>
            #bp-game-canvas {
                border: 1px solid black;
                margin: 10px;
            }
            button {
                display: block;
                padding: 10px 20px;
                font-size: 20px;
                margin: 10px auto;
                background-color: #28a745;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            }
            button:hover {
                background-color: #218838;
            }
        </style>
        <p id="message">Work On Workstation</p>
        <canvas id="bp-game-canvas" width="500" height="300"></canvas>
        <button id="previous-station-button">Previous Station</button>
        <button id="next-station-button">Next Station</button>
        <p id="completedCarsElement">Cars completed: 0</p>
        <p id="partsAddedElement">0/0 parts added</p>
        <button id="move-car-button">Move Car to Next Station</button>
        <button id = "quality-control">Quality Control</button> 
        <div id="current-workstation">
          <span class="maintenance-timer"></span>
        </div>
        `;
  }
}
