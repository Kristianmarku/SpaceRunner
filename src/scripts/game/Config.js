import { GameOverScene } from "../game-over/GameOverScene";
import { MenuScene } from "../menu/MenuScene";
import { Tools } from "../system/Tools";
import { GameScene } from "./GameScene";

export const Config = {
  bgSpeed: 2,
  diamonds: {
    chance: 0.4,
    offset: {
      min: 100,
      max: 200,
    },
  },
  hero: {
    jumpSpeed: 15, // 15 default
    maxJumps: 2,
    position: {
      x: 350,
      y: 595,
    },
  },
  platforms: {
    moveSpeed: -1.5, // -1.5 default
    ranges: {
      rows: {
        min: 2,
        max: 6,
      },
      cols: {
        min: 3,
        max: 9,
      },
      offset: {
        min: 60,
        max: 200,
      },
    },
  },

  loader: Tools.massiveRequire(
    require["context"]("./../../sprites/", true, /\.(mp3|png|jpe?g)$/)
  ),
  scenes: {
    MenuScene: MenuScene,
    GameScene: GameScene,
    GameOverScene: GameOverScene,
  },
};
