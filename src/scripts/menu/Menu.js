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
    const margin = 500;

    const playButton = new PIXI.Text("Start Game", {
      fontFamily: "Arial",
      fontSize: 36,
      fill: "white",
    });
    playButton.anchor.set(0.5);
    playButton.x = margin + playButton.width / 2;
    playButton.y = App.app.screen.height / 2;
    playButton.interactive = true;
    playButton.buttonMode = true;
    playButton.on("pointerdown", () => {
      // Emit an event to notify the parent container that the play button is clicked
      this.emit("playButtonClicked");
    });
    this.container.addChild(playButton);
  }

  destroy() {
    this.container.destroy();
  }
}
