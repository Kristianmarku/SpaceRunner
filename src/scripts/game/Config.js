import { GameOverScene } from "../game-over/GameOverScene";
import { MenuScene } from "../menu/MenuScene";
import { Tools } from "../system/Tools";
import { GameScene } from "./GameScene";

export const Config = {
  difficulty: "normal",
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
        min: 1, // 2 default
        max: 10, // 6 default
      },
      cols: {
        min: 1, // 3
        max: 15, // 9
      },
      offset: {
        min: 60, // 60
        max: 220, // 200
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
