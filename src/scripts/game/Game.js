import { App } from "../system/App";
import { Scene } from "../system/Scene";
import { Background } from "./Background";
import { Hero } from "./Hero";
import { Platforms } from "./Platforms";

export class Game extends Scene {
  create() {
    this.createBackground();
    this.createPlatforms();
    this.createHero();
  }

  createPlatforms() {
    this.platforms = new Platforms();
    this.container.addChild(this.platforms.container);
  }

  createHero() {
    this.hero = new Hero();
    this.container.addChild(this.hero.sprite);
    this.container.interactive = true;
    this.container.on("pointerdown", () => {
      this.hero.startJump();
    });
  }

  createBackground() {
    this.bg = new Background();
    this.container.addChild(this.bg.container);
  }
  update(dt) {
    this.bg.update(dt);
    this.platforms.update(dt);
  }
}
