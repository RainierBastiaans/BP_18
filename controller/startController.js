import GameFacade from "../model/gameFacade.js";
import StartView from "../view/startView.js";
import { GameController } from "./gameController.js";

class StartController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.bindEventListeners();

    this.init();
  }

  show() {
    this.view.show();
  }

  hide() {
    this.view.hide();
  }

  bindEventListeners() {
    console.log("bindEventListeners");
    this.view.bindStartButtonClick(this.handleStartGame);
    this.view.bindGameOptionSelected(this.handleOptionsChange);
    //this.view.addEventListener("click", this.startGame.bind(this));
    //this.view.addEventListener("change", this.handleOptionsChange.bind(this));
  }

  init() {
    this.show();
  }

  handleStartGame = (event) => {
    const options = this.view.getSelectedOptions();
    //hide start screen
    this.hide();

    document.dispatchEvent(new CustomEvent("startgame", { detail: options }));
  };

  // handleOptionsChange = (event) => {
  //   // Update model with new options
  //   const selectedOptions = this.view.getSelectedOptions();
  //   this.model.setOptions(selectedOptions);
  // };

  // //Options change
  // gameOptions.addEventListener("optionschange", (event) => {
  //   selectedOption = event.detail.selectedOption;
  // });

  // onModelChanged = (model) => {
  //   this.view.render(model);
  // };

  // handleStartGame = (options) => {
  //   this.gameFacade.startGame(options);
  //   // Additional logic related to starting the game...
  // };

  // Additional methods for handling home page interactions...
}

export default StartController;
