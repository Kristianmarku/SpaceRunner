import * as PIXI from "pixi.js";
import { App } from "../system/App";

export class Menu extends PIXI.utils.EventEmitter {
  constructor() {
    super(); // Call the parent constructor
    this.container = new PIXI.Container();
    this.createSprite();
    this.createBackground();
    this.createButtons();

    // Listen for difficulty changes
    this.on("difficultyChanged", () => {
      this.updateButtonColors();
    });

    this.on("backgroundButtonClicked", () => {
      this.updateButtonColors();
    });
  }

  createSprite() {
    const sprite = App.sprite("menu");
    sprite.y = 0;
    this.container.addChild(sprite);
  }

  createBackground() {
    const texture = PIXI.Texture.from("menu"); // Load your menu background image
    const sprite = new PIXI.Sprite(texture);

    // Scale the sprite to fit the stage while maintaining aspect ratio
    sprite.width = App.app.screen.width;
    sprite.height = App.app.screen.height;

    this.container.addChild(sprite);
  }

  createButtons() {
    // Determine base screen resolution
    const baseScreenWidth = 1920;
    const baseScreenHeight = 1080;

    // Calculate scaling factors
    const scaleX = App.app.screen.width / baseScreenWidth;
    const scaleY = App.app.screen.height / baseScreenHeight;

    // Adjusted margin based on scaling factors
    const margin = 300 * Math.min(scaleX, scaleY);

    // Calculate Y position for the "Play" text
    const playTextY = App.app.screen.height / 2 - 150;

    // Create "Play" text
    const playText = new PIXI.Text("Play", {
      fontFamily: "Arial",
      fontSize: 24,
      fill: "white",
    });
    playText.anchor.set(0.5);
    playText.position.set(margin + 20, playTextY);

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
      playButtonContainer.y + playButtonContainer.height + 50;

    // Create "Select Difficulty" text
    const selectDifficultyText = new PIXI.Text("Select Difficulty", {
      fontFamily: "Arial",
      fontSize: 24,
      fill: "white",
    });
    selectDifficultyText.anchor.set(0.5);
    selectDifficultyText.position.set(margin + 80, selectDifficultyY);

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

    // Calculate Y position for the "Allow Music" text
    const allowMusicTextY =
      playButtonContainer.y + playButtonContainer.height + 220;

    // Create "Allow Music" text
    const allowMusicText = new PIXI.Text("Allow Music", {
      fontFamily: "Arial",
      fontSize: 24,
      fill: "white",
    });
    allowMusicText.anchor.set(0.5);
    allowMusicText.position.set(margin + 65, allowMusicTextY);

    // Calculate Y position for the "Background" button
    const backgroundButton = allowMusicText.y + allowMusicText.height + 10;

    // Create "Background" button
    this.allowMusicContainer = this.createButtonContainer(
      "Background",
      margin,
      backgroundButton,
      App.musicAllowed === true ? "0x00FF00" : "0xFF0000"
    );
    this.allowMusicContainer.on("pointerdown", () => {
      App.musicAllowed = !App.musicAllowed;
      this.emit("backgroundButtonClicked");
    });

    // Add buttons and text to the container
    this.container.addChild(
      playText,
      playButtonContainer,
      selectDifficultyText,
      allowMusicText,
      this.hardButtonContainer,
      this.mediumButtonContainer,
      this.allowMusicContainer
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

    // Update "AllowMusic" button color
    const allowMusicButtonColor =
      App.musicAllowed === true ? "0x00FF00" : "0xFF0000";
    this.allowMusicContainer.getChildAt(0).clear();
    this.allowMusicContainer.getChildAt(0).beginFill(allowMusicButtonColor);
    this.allowMusicContainer
      .getChildAt(0)
      .drawRect(
        0,
        0,
        this.allowMusicContainer.buttonText.width + 20,
        this.allowMusicContainer.buttonText.height + 10
      );
    this.allowMusicContainer.getChildAt(0).endFill();
  }

  destroy() {
    this.container.destroy();
  }
}
