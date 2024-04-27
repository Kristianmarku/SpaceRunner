import * as PIXI from "pixi.js";
import { App } from "../system/App";
import { Scene } from "../system/Scene";
import { GameOver } from "./GameOver";

export class GameOverScene extends Scene {
  constructor() {
    super();
  }

  create() {
    this.createGameOver();
    this.displayScore();
    this.displayMotivationText();
  }

  createGameOver() {
    this.gameOver = new GameOver();
    this.container.addChild(this.gameOver.container);
  }

  displayScore() {
    const scoreText = new PIXI.Text(`You collected ${App.score} points.`, {
      fontFamily: "Arial",
      fontSize: 24,
      fill: "white",
    });
    scoreText.anchor.set(0.5);
    scoreText.x = App.app.screen.width / 2;
    scoreText.y = App.app.screen.height / 2 - 50;
    this.container.addChild(scoreText);
  }

  displayMotivationText() {
    const scoreText = new PIXI.Text(`Try again, you can do better!`, {
      fontFamily: "Arial",
      fontSize: 24,
      fill: "white",
    });
    scoreText.anchor.set(0.5);
    scoreText.x = App.app.screen.width / 2;
    scoreText.y = App.app.screen.height / 2 + 50;
    this.container.addChild(scoreText);
  }
}
