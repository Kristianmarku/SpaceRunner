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

    this.container.addChild(this.scene.container);

    // Listen for playButtonClicked event emitted by the Menu class
    if (SceneClass === App.config.scenes["MenuScene"]) {
      this.scene.menu.on("playButtonClicked", () => {
        this.start("GameScene");
      });
    }

    // Listen for resetGameButtonClicked event emitted by the Menu class
    if (SceneClass === App.config.scenes["GameOverScene"]) {
      this.scene.gameOver.on("resetGameButtonClicked", () => {
        this.start("GameScene");
      });
    }
  }
}
