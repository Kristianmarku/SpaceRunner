import * as PIXI from "pixi.js";
import { App } from "../system/App";

export class Menu extends PIXI.utils.EventEmitter {
  constructor() {
    super(); // Call the parent constructor
    this.container = new PIXI.Container();
    this.createSprite();
    this.createPlayButton();
  }

  createSprite() {
    const sprite = App.sprite("menu");

    // sprite.x = sprite.width;
    sprite.y = 0;
    this.container.addChild(sprite);
  }

  // Create play button
  createPlayButton() {
    // Create text for the button
    const playButtonText = new PIXI.Text("Start Game", {
      fontFamily: "Arial",
      fontSize: 36,
      fill: "white", // Text color
    });

    // Calculate the position of the text within the button
    playButtonText.position.set(
      10, // Adjust the x-coordinate to leave some margin on the left
      -playButtonText.height / 2 // Center vertically
    );

    // Create a container for the button
    const playButtonContainer = new PIXI.Container();
    playButtonContainer.position.set(
      450, // Adjust the x-coordinate to leave some margin on the left
      App.app.screen.height / 2
    );

    // Create button background shape (rectangle)
    const buttonBackground = new PIXI.Graphics();
    buttonBackground.beginFill(0x007bff); // Bootstrap primary color
    buttonBackground.drawRect(
      0, // Start from the left edge
      -playButtonText.height / 2 - 5, // Add some padding
      playButtonText.width + 20, // Add padding to both sides
      playButtonText.height + 10 // Add padding to both top and bottom
    );
    buttonBackground.endFill();

    // Add the button text to the container
    playButtonContainer.addChild(buttonBackground, playButtonText);

    // Make the button interactive
    playButtonContainer.interactive = true;
    playButtonContainer.buttonMode = true;

    // Add pointer events to the button
    playButtonContainer.on("pointerdown", () => {
      // Emit an event to notify the parent container that the play button is clicked
      this.emit("playButtonClicked");
    });

    // Add the button container to the menu container
    this.container.addChild(playButtonContainer);
  }

  destroy() {
    this.container.destroy();
  }
}
