import * as PIXI from "pixi.js";
import { App } from "./App";

export class ScenesManager {
  constructor() {
    this.container = new PIXI.Container();
    this.container.interactive = true;
    this.scene = null;
  }

  start(scene) {
    if (this.scene) {
      this.scene.remove();
    }

    const SceneClass = App.config.scenes[scene];
    if (!SceneClass) {
      console.error(`Scene '${scene}' not found in config.`);
      return;
    }

    this.scene = new SceneClass();
    if (!this.scene || !this.scene.container) {
      console.error(`Scene '${scene}' or its container is invalid.`);
      return;
    }

    // Remove any existing scenes before adding the new one
    this.container.removeChildren();

    this.container.addChild(this.scene.container);

    // Reset game parameters if restarting from GameOverScene
    if (SceneClass === App.config.scenes["GameOverScene"]) {
      App.score = 0;
      App.config.platforms.moveSpeed = -1.5;
      App.config.bgSpeed = 2;
    }

    // Listen for playButtonClicked event emitted by the Menu class
    if (SceneClass === App.config.scenes["MenuScene"]) {
      this.scene.menu.on("playButtonClicked", () => {
        this.start("GameScene");
      });

      // Listen for hardButtonClicked event emitted by the Menu class
      this.scene.menu.on("hardButtonClicked", () => {
        // Update game difficulty to hard
        App.config.difficulty = "hard";
        // Emit difficulty changed event
        this.scene.menu.emit("difficultyChanged");
      });

      // Listen for mediumButtonClicked event emitted by the Menu class
      this.scene.menu.on("mediumButtonClicked", () => {
        // Update game difficulty to medium
        App.config.difficulty = "medium";
        // Emit difficulty changed event
        this.scene.menu.emit("difficultyChanged");
      });
    }

    // Listen for resetGameButtonClicked event emitted by the Menu class
    if (SceneClass === App.config.scenes["GameOverScene"]) {
      this.scene.gameOver.on("resetGameButtonClicked", () => {
        this.start("GameScene");
      });

      // if lobby button is clicked
      this.scene.gameOver.on("lobbyButtonClicked", () => {
        this.start("MenuScene");
        App.config.difficulty = "normal";
        this.scene.menu.emit("difficultyChanged");
      });
    }
  }
}
