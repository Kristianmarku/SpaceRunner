import * as PIXI from "pixi.js";
import { App } from "../system/App";

export class Menu extends PIXI.utils.EventEmitter {
  constructor() {
    super(); // Call the parent constructor
    this.container = new PIXI.Container();
    this.createSprite();
    this.createButtons();

    // Listen for difficulty changes
    this.on("difficultyChanged", () => {
      this.updateButtonColors();
    });
  }

  createSprite() {
    const sprite = App.sprite("menu");
    sprite.y = 0;
    this.container.addChild(sprite);
  }

  createButtons() {
    const margin = 450;

    // Calculate Y position for the "Play" text
    const playTextY = App.app.screen.height / 2 - 150;

    // Create "Play" text
    const playText = new PIXI.Text("Play", {
      fontFamily: "Arial",
      fontSize: 24,
      fill: "white",
    });
    playText.anchor.set(0.5);
    playText.position.set(470, playTextY);

    // Create "Start Game" button
    const playButtonContainer = this.createButtonContainer(
      "Start Game",
      margin,
      playTextY + playText.height + 20, // Adjusted Y position to accommodate "Play" text
      "0x007bff"
    );
    playButtonContainer.on("pointerdown", () => {
      this.emit("playButtonClicked");
    });

    // Calculate Y position for the "Select Difficulty" text
    const selectDifficultyY =
      playButtonContainer.y + playButtonContainer.height + 100;

    // Create "Select Difficulty" text
    const selectDifficultyText = new PIXI.Text("Select Difficulty", {
      fontFamily: "Arial",
      fontSize: 24,
      fill: "white",
    });
    selectDifficultyText.anchor.set(0.5);
    selectDifficultyText.position.set(530, selectDifficultyY);

    // Calculate Y position for the "Hard" button
    const hardButtonY =
      selectDifficultyText.y + selectDifficultyText.height + 20;

    // Create "Hard" button
    this.hardButtonContainer = this.createButtonContainer(
      "Hard",
      margin,
      hardButtonY,
      App.config.difficulty === "hard" ? "0x00FF00" : "0x808080"
    );
    this.hardButtonContainer.on("pointerdown", () => {
      this.emit("hardButtonClicked");
    });

    // Calculate Y position for the "Medium" button
    const mediumButtonY =
      this.hardButtonContainer.y + this.hardButtonContainer.height + 10;

    // Create "Medium" button
    this.mediumButtonContainer = this.createButtonContainer(
      "Medium",
      margin,
      mediumButtonY,
      App.config.difficulty === "medium" ? "0x00FF00" : "0x808080"
    );
    this.mediumButtonContainer.on("pointerdown", () => {
      this.emit("mediumButtonClicked");
    });

    // Add buttons and text to the container
    this.container.addChild(
      playText,
      playButtonContainer,
      selectDifficultyText,
      this.hardButtonContainer,
      this.mediumButtonContainer
    );
  }

  createButtonContainer(text, x, y, color) {
    const buttonText = new PIXI.Text(text, {
      fontFamily: "Arial",
      fontSize: 24,
      fill: "white",
    });
    buttonText.anchor.set(0.5);

    const buttonContainer = new PIXI.Container();
    buttonContainer.position.set(x, y);

    const buttonBackground = new PIXI.Graphics();
    buttonBackground.beginFill(color); // button background color
    buttonBackground.drawRect(
      0, // Start from the left edge
      0, // Start from the top edge
      buttonText.width + 20, // Add padding to both sides
      buttonText.height + 10 // Add padding to both top and bottom
    );
    buttonBackground.endFill();

    buttonText.position.set(
      buttonBackground.width / 2, // Center horizontally
      buttonBackground.height / 2 // Center vertically
    );

    buttonContainer.addChild(buttonBackground, buttonText);
    buttonContainer.interactive = true;
    buttonContainer.buttonMode = true;

    // Store buttonText as a property of buttonContainer
    buttonContainer.buttonText = buttonText;

    return buttonContainer;
  }

  updateButtonColors() {
    // Update "Hard" button color
    const hardButtonColor =
      App.config.difficulty === "hard" ? "0x00FF00" : "0x808080";
    this.hardButtonContainer.getChildAt(0).clear();
    this.hardButtonContainer.getChildAt(0).beginFill(hardButtonColor);
    this.hardButtonContainer
      .getChildAt(0)
      .drawRect(
        0,
        0,
        this.hardButtonContainer.buttonText.width + 20,
        this.hardButtonContainer.buttonText.height + 10
      );
    this.hardButtonContainer.getChildAt(0).endFill();

    // Update "Medium" button color
    const mediumButtonColor =
      App.config.difficulty === "medium" ? "0x00FF00" : "0x808080";
    this.mediumButtonContainer.getChildAt(0).clear();
    this.mediumButtonContainer.getChildAt(0).beginFill(mediumButtonColor);
    this.mediumButtonContainer
      .getChildAt(0)
      .drawRect(
        0,
        0,
        this.mediumButtonContainer.buttonText.width + 20,
        this.mediumButtonContainer.buttonText.height + 10
      );
    this.mediumButtonContainer.getChildAt(0).endFill();
  }

  destroy() {
    this.container.destroy();
  }
}
