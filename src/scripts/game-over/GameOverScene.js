import { Scene } from "../system/Scene";
import { GameOver } from "./GameOver";

export class GameOverScene extends Scene {
  create() {
    this.createGameOver();
  }

  createGameOver() {
    this.gameOver = new GameOver();
    this.container.addChild(this.gameOver.container);
  }
}
