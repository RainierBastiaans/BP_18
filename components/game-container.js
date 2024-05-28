export const gameTemplate = document.createElement("template");
gameTemplate.innerHTML = `
<link rel="stylesheet" href="styles.css">
<p id="message">Work On Workstation</p>
<div class="car-container" id="car-container"></div>
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
