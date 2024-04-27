import * as PIXI from "pixi.js";
import { App } from "../system/App";

export class GameOver extends PIXI.utils.EventEmitter {
  constructor() {
    super();
    this.container = new PIXI.Container();
    this.createSprite();
    this.createResetButton();
  }

  createSprite() {
    const sprite = App.sprite("gameover");

    // sprite.x = sprite.width;
    sprite.y = 0;
    this.container.addChild(sprite);
  }

  // Create play button
  createResetButton() {
    const playButton = new PIXI.Text("Restart Game", {
      fontFamily: "Arial",
      fontSize: 36,
      fill: "white",
    });
    playButton.anchor.set(0.5);
    playButton.x = App.app.screen.width / 2;
    playButton.y = App.app.screen.height / 2;
    playButton.interactive = true;
    playButton.buttonMode = true;
    playButton.on("pointerdown", () => {
      // Emit an event to notify the parent container that the reset button is clicked
      this.emit("resetGameButtonClicked");
    });
    this.container.addChild(playButton);
  }

  destroy() {
    this.container.destroy();
  }
}
