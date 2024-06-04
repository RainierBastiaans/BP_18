import EventEmitter from "../../eventEmitter.js";

class StartButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
            <style>
                button {
                    display: block;
                    padding: 10px 20px;
                    font-size: 20px;
                    margin: 30px auto;
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
            <button id="startButton">Start Game</button>
        `;
    /* 
        This allows any event listeners on the main document or other parent elements to detect
        and handle the startgame event, facilitating interaction between encapsulated components and the broader application.
    */
    this.shadowRoot
      .querySelector("#startButton")
      .addEventListener("click", () => {
        EventEmitter.emit("startgame", { bubbles: true, composed: true });
      });
  }
}

customElements.define("start-button", StartButton);
