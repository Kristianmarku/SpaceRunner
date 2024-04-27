import * as PIXI from "pixi.js";
import { App } from "../system/App";

export class GameOver extends PIXI.utils.EventEmitter {
  constructor() {
    super();
    this.container = new PIXI.Container();
    this.createSprite();
    this.createResetButton();
    this.createLobbyButton();
  }

  createSprite() {
    const sprite = App.sprite("gameover");

    // sprite.x = sprite.width;
    sprite.y = 0;
    this.container.addChild(sprite);
  }

  // Create reset button
  createResetButton() {
    // Create text for the button
    const resetButtonText = new PIXI.Text("Restart Game", {
      fontFamily: "Arial",
      fontSize: 36,
      fill: "white", // Text color
    });

    // Calculate the position of the text within the button
    resetButtonText.position.set(
      -resetButtonText.width / 2, // Center horizontally
      -resetButtonText.height / 2 // Center vertically
    );

    // Create a container for the button
    const resetButtonContainer = new PIXI.Container();
    resetButtonContainer.position.set(
      App.app.screen.width / 2,
      App.app.screen.height / 2
    );

    // Create button background shape (rectangle)
    const buttonBackground = new PIXI.Graphics();
    buttonBackground.beginFill(0x007bff); // Bootstrap primary color
    buttonBackground.drawRect(
      -resetButtonText.width / 2 - 10, // Add some padding
      -resetButtonText.height / 2 - 5, // Add some padding
      resetButtonText.width + 20, // Add padding to both sides
      resetButtonText.height + 10 // Add padding to both top and bottom
    );
    buttonBackground.endFill();

    // Add the button text to the container
    resetButtonContainer.addChild(buttonBackground, resetButtonText);

    // Make the button interactive
    resetButtonContainer.interactive = true;
    resetButtonContainer.buttonMode = true;

    // Add pointer events to the button
    resetButtonContainer.on("pointerdown", () => {
      // Emit an event to notify the parent container that the reset button is clicked
      this.emit("resetGameButtonClicked");
    });

    // Add the button container to the game over container
    this.container.addChild(resetButtonContainer);
  }

  createLobbyButton() {
    // Create text for the button
    const lobbyButtonText = new PIXI.Text("Back to Lobby", {
      fontFamily: "Arial",
      fontSize: 36,
      fill: "white", // Text color
    });

    // Calculate the position of the text within the button
    lobbyButtonText.position.set(
      -lobbyButtonText.width / 2, // Center horizontally
      -lobbyButtonText.height / 2 // Center vertically
    );

    // Create a container for the button
    const lobbyButtonContainer = new PIXI.Container();
    lobbyButtonContainer.position.set(
      App.app.screen.width / 2,
      App.app.screen.height / 2 + 150
    );

    // Create button background shape (rectangle)
    const buttonBackground = new PIXI.Graphics();
    buttonBackground.beginFill(0xff0000); // red color
    buttonBackground.drawRect(
      -lobbyButtonText.width / 2 - 10, // Add some padding
      -lobbyButtonText.height / 2 - 5, // Add some padding
      lobbyButtonText.width + 20, // Add padding to both sides
      lobbyButtonText.height + 10 // Add padding to both top and bottom
    );
    buttonBackground.endFill();

    // Add the button text to the container
    lobbyButtonContainer.addChild(buttonBackground, lobbyButtonText);

    // Make the button interactive
    lobbyButtonContainer.interactive = true;
    lobbyButtonContainer.buttonMode = true;

    // Add pointer events to the button
    lobbyButtonContainer.on("pointerdown", () => {
      // Emit an event to notify the parent container that the reset button is clicked
      this.emit("lobbyButtonClicked");
    });

    // Add the button container to the game over container
    this.container.addChild(lobbyButtonContainer);
  }

  destroy() {
    this.container.destroy();
  }
}
